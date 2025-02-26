import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import axios from "axios";

//INTERNAL IMPORT
import {
  checkIfWalletConnected,
  connectWallet,
  connectingWithBooToken,
  connectingWithLIfeToken,
  connectingWithSingleSwapToken,
  connectingWithIWTHToken,
  connectingWithDAIToken,
  connectingWithUserStorageContract,
} from "../Utils/appFeatures";

// import { getPrice } from '../Utils/fetchingPrice'
// import { swapUpdatePrice } from '../Utils/swapUpdatePrice'
// import { addLiquidityExternal } from "../Utils/addLiquidity";
// import { getLiquidityData } from "../Utils/checkLiquidity";
// import { connectingWithPoolContract } from "../Utils/deployPool";

import { IWETHABI } from "./constants";


export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
  const swap = "welcome to swap my token"

  //USSTATE
  const [account, setAccount] = useState("");
  const [ether, setEther] = useState("");
  const [networkConnect, setNetworkConnect] = useState("");
  const [weth9, setWeth9] = useState("");
  const [dai, setDai] = useState("");

  const [tokenData, setTokenData] = useState([]);
  const [getAllLiquidity, setGetAllLiquidity] = useState([]);
  // TOP TOKENS
  const [topTokensList, setTopTokensList] = useState([]);

  const addToken = [
    "0xC1dC7a8379885676a6Ea08E67b7Defd9a235De71",
    "0xf0F5e9b00b92f3999021fD8B88aC75c351D93fc7",
    "0xCC9676b9bf25cE45a3a5F88205239aFdDeCF1BC7",
  ];

  const fetchAccountData = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // Get the user's account address
      const userAccount = await signer.getAddress();
      setAccount(userAccount);

      // Fetch the balance
      const balance = await provider.getBalance(userAccount);
      const balanceInEth = ethers.utils.formatEther(balance);
      setEther(balanceInEth);

      console.log("Account:", userAccount);
      console.log("Balance:", balanceInEth);

      // 获取网络信息
      const network = await provider.getNetwork();
      console.log(network);
      setNetworkConnect(network.name);

      // 获取所有代币余额和数据
      addToken.map(async (el, i) => {
        // 获取代币合约
        const contract = new ethers.Contract(el, ERC20, provider);
        // 获取代币余额
        const userBalance = await contract.balanceOf(userAccount);
        const tokenLeft = BigNumber.from(userBalance).toString();
        const convertTokenBal = ethers.utils.formatEther(tokenLeft);

        // 获取代币名称和符号
        const symbol = await contract.symbol();
        const name = await contract.name();

        // 将代币数据推入 tokenData 数组
        tokenData.push({
          name: name,
          symbol: symbol,
          tokenBalance: convertTokenBal,
          tokenAddress: el,
        });
      });

    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  return (
    <SwapTokenContext.Provider value={{
    swap,
    account,
    ether,
    networkConnect,
    tokenData,
    topTokensList
    }}>
      {children}
    </SwapTokenContext.Provider>
  )
}