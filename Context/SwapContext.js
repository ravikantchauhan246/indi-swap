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
import ERC20 from "./ERC20.json";

export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
  const swap = "welcome to swap my token";

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
  ].filter(address => ethers.utils.isAddress(address));

  const fetchAccountData = async () => {
    try {
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);
  
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
  
      // Fetch account details
  
      const balance = await provider.getBalance(userAccount);
      console.log("SWeekar",balance);
      
  const ethValue=ethers.utils.formatEther(balance);
      
  setEther(ethValue);
  
  // Fetch network details
  
  const networkDetailsResponse=await provider.getNetwork();
  
  setNetworkConnect(networkDetailsResponse.name);
  
  
  // Fetch all tokens' balances
  
  
  let fetchedTokens=[];
  
  for(let i=0;i<addToken.length;i++){
    
  try{
    
  let el=addToken[i];
  
  let currentContract=new ethers.Contract(el , ERC20.abi ,provider)
  
  console.log(currentContract,"contract created")
  
  let fetchedUserBalance=(await currentContract.balanceOf(userAccount).catch((err)=>{
    console.error(`Error fetching balance for token ${el}:`, err);
    return BigNumber.from(0)
  }))
  
  if(fetchedUserBalance.toString()==="0"){
    console.log(`Skipping token ${el} due to zero balance.`);
  }else{
  console.log(`Non-zero balance found for token ${el}.`);
  }
  
  fetchedUserBalance=fetchedUserBalance.toString()
  
  // Convert balance to ether format if needed
  const convertBal=fetchedUserBalance;
  
  const symbol=(await currentContract.symbol().catch((err)=>{
    console.error(`Error fetching symbol for token ${el}:`, err);
    return 'unknown';
  }));
  
  const name=(await currentContract.name().catch((err)=>{
    console.error(`Error fetching name for token ${el}:`, err);
    return 'unknown';
  }));
  
  console.log("Fetched details:",name,symbol,fetchedUserBalance)
  
  if(fetchedUserBalance !== "0"){
  fetchedTokens.push({
  name:name ,
  symbol:symbol ,
  tokenBalance:convertBal ,
  tokenAddress:currentContract.address ,
  
  })
  }else{
  console.log("Not adding token due to zero balance.");
  }
  
  }
    
  
  catch(e){
  console.warn('Unexpected Error Occured',e)
  }
  
  }
  
  if(fetchedTokens.length === 0){
  console.warn("No non-zero balances found among specified tokens.");
  }else{
  console.log("Successfully fetched non-zero balances:", fetchedTokens);
  }
  
  setTokenData(fetchedTokens)

  
  
  } catch (error) {
  
  if(error instanceof ReferenceError){
  console.error("Reference Error:",error.message,"at line",error.lineNumber)
  }else{
  console.warn('fetching account data failed',error)
  }
  }
  };
  

  useEffect(() => {
    fetchAccountData();
  }, []);

  return (
    <SwapTokenContext.Provider
      value={{
        swap,
        account,
        ether,
        networkConnect,
        tokenData,
        topTokensList,
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};
