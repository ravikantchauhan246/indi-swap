import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "ethers/lib/utils";
import axios from "axios";

import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";

import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";
import { addLiquidityExtrenal } from "../Utils/addLiquidity";
import { getLiquidityData } from "../Utils/checkLiquidity";
import { connectingWithPoolContract } from "../Utils/deployPool";

import {
  checkIfWalletConnected,
  connectWallet,
  connecttingWithBooToken,
  connecttingWithLifeToken,
  connecttingWithSingleSwapToken,
  connecttingWithIWETHToken,
  connecttingWithDAIToken,
  connecttingWithUserStorageContract,
} from "../Utils/appFeatures";

import { IWETHABI } from "./constants";
import ERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";

export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [ether, setEther] = useState("");
  const [networkConnect, setNetworkConnect] = useState("");
  const [weth9, setWeth9] = useState("");
  const [dai, setDai] = useState("");

  const [tokenData, setTokenData] = useState([]);
  const [getAllLiquidity, setGetAllLiquidity] = useState([]);

  const [topTokenList, setTopTokenList] = useState([]);
  const [tokenPriceHistory, setTokenPriceHistory] = useState({});
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  const addToken = [
    "0xdccF554708B72d0fe9500cBfc1595cDBE3d66e5a",
    "0x645B0f55268eF561176f3247D06d0b7742f79819",
    "0x9581c795DBcaf408E477F6f1908a41BE43093122",
    "0x3CA5269B5c54d4C807Ca0dF7EeB2CB7a5327E77d",
    "0x8a6E9a8E0bB561f8cdAb1619ECc4585aaF126D73",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  ];

  const fetchingData = async () => {
    try {
      setIsLoadingTokens(true);
      //Get user account
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);

      //Create provider
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new Web3Provider(window.ethereum);

      //Check balance
      const balance = await provider.getBalance(userAccount);
      const convertBal = formatUnits(balance, 18);
      setEther(convertBal);

      //All Token Balnace
      addToken.map(async (el, i) => {
        //Getting Contract
        const contract = new ethers.Contract(el, ERC20.abi, provider);

        //Convert Balance
        const userBalance = await contract.balanceOf(userAccount);
        const tokenLeft = BigNumber.from(userBalance).toString();
        const convertTokenBal = ethers.utils.formatEther(tokenLeft);

        //Get Network
        const network = await provider.getNetwork();
        setNetworkConnect(network.name);

        //Get Name And Symbol
        const symbol = await contract.symbol();
        const name = await contract.name();

        tokenData.push({
          name: name,
          symbol: symbol,
          tokenBalance: convertTokenBal,
          tokenAddress: el,
        });
      });

      // For token analytics, we'll use CoinGecko API as it's free and reliable
      try {
        // Get top tokens from CoinGecko
        const topTokensResponse = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 20,
              page: 1,
              sparkline: false
            }
          }
        );
        
        // Format the token data to match our application's structure
        const formattedTokens = topTokensResponse.data.map((token, index) => ({
          id: token.id,
          name: token.name,
          symbol: token.symbol.toUpperCase(),
          image: token.image,
          price: `$${token.current_price.toLocaleString()}`,
          change: `${token.price_change_percentage_24h.toFixed(2)}%`,
          tvl: `$${(token.market_cap / 1000000).toFixed(1)} M`,
          volume: `$${(token.total_volume / 1000000).toFixed(1)} M`,
          number: index + 1,
          marketCap: token.market_cap,
          priceData: null // We'll populate this later for individual tokens
        }));

        setTopTokenList(formattedTokens);
      } catch (error) {
        console.error("Error fetching token data from CoinGecko:", error);
      }
      
      setIsLoadingTokens(false);
    } catch (error) {
      console.log(error);
      setIsLoadingTokens(false);
    }
  };

  // New function to fetch price history for a specific token
  const fetchTokenPriceHistory = async (tokenId) => {
    try {
      // Check if we already have the data cached
      if (tokenPriceHistory[tokenId]) {
        return tokenPriceHistory[tokenId];
      }

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: 14,
            interval: 'daily'
          }
        }
      );

      // Process the price data for chart display
      const priceData = response.data.prices.map(item => ({
        timestamp: item[0],
        price: item[1]
      }));

      // Cache the data
      setTokenPriceHistory(prev => ({
        ...prev,
        [tokenId]: priceData
      }));

      return priceData;
    } catch (error) {
      console.error(`Error fetching price history for ${tokenId}:`, error);
      return [];
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  //Create and add Liquidity
  const createLiquidityAndPool = async ({
    tokenAddress0,
    tokenAddress1,
    fee,
    tokenPrice1,
    tokenPrice2,
    slippage,
    deadline,
    tokenAmmount0,
    tokenAmmount1,
  }) => {
    try {
      console.log(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        slippage,
        deadline,
        tokenAmmount0,
        tokenAmmount1
      );

      //Create pool
      const createPool = await connectingWithPoolContract(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        { gasLimit: 500000 }
      );
      const poolAddress = createPool;
      console.log("poolAddress", poolAddress);
    } catch (error) {
      console.log(error);
    }
  };

  const singleSwapToken = async ({ token1, token2, swapAmount }) => {
    try {
      // Validate inputs
      if (!token1 || !token2 || !token1.tokenAddress || !token2.tokenAddress) {
        throw new Error("Invalid token addresses");
      }
  
      if (swapAmount <= 0) {
        throw new Error("Swap amount must be greater than 0");
      }
  
      console.log("Token 1 Address:", token1.tokenAddress);
      console.log("Token 2 Address:", token2.tokenAddress);
      console.log("Swap Amount:", swapAmount);
  
      // Get contracts
      const singleSwapToken = await connecttingWithSingleSwapToken();
      const weth = await connecttingWithIWETHToken();
      const dai = await connecttingWithDAIToken();
      console.log("SingleSwapToken contract:", singleSwapToken);
      console.log("WETH contract:", weth);
      console.log("DAI contract:", dai);
  
      // Convert amount with proper decimals (assuming 18 decimals for WETH)
      const decimals = 18;
      const amountIn = ethers.utils.parseUnits(
        swapAmount.toString(),
        decimals
      );
  
      console.log("Amount In (wei):", amountIn.toString());
  
      // Deposit ETH and get WETH
      const depositTx = await weth.deposit({ value: amountIn });
      await depositTx.wait();
      console.log("WETH deposit successful");
  
      // Approve SingleSwap contract to spend WETH
      const approveTx = await weth.approve(singleSwapToken.address, amountIn);
      await approveTx.wait();
      console.log("Approval successful");
  
      // Perform the swap
      console.log("Initiating swap...");
      const swapTx = await singleSwapToken.swapExactInputSingle(
        token1.tokenAddress,
        token2.tokenAddress,
        amountIn,
        {
          gasLimit: 500000,
        }
      );
      console.log("Swap transaction:", swapTx);

      const receipt = await swapTx.wait();
      console.log("Swap successful:", receipt.transactionHash);
  
      // Check resulting DAI balance
      const daiBalance = await dai.balanceOf(account);
      const daiAmount = ethers.utils.formatUnits(daiBalance, 18);
      
      setDai(daiAmount);
      console.log("New DAI Balance:", daiAmount);
  
      return { success: true, txHash: receipt.transactionHash };
  
    } catch (error) {
      console.error("Swap failed:", error);
      if (error.code === 'INVALID_ARGUMENT') {
        console.error("Invalid token addresses provided");
      }
      throw error; // Re-throw to allow UI to handle the error
    }
  };

  useEffect(() => {
    singleSwapToken();
  }, []);

  return (
    <SwapTokenContext.Provider
      value={{
        singleSwapToken,
        connectWallet,
        getPrice,
        swapUpdatePrice,
        createLiquidityAndPool,
        getAllLiquidity,
        account,
        networkConnect,
        ether,
        weth9,
        dai,
        tokenData,
        topTokenList,
        fetchTokenPriceHistory,
        isLoadingTokens,
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};
