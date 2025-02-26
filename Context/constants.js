// BOO deployed to 0xeF66010868Ff77119171628B7eFa0F6179779375
// Life deployed to 0xd544d7A5EF50c510f3E90863828EAba7E392907A
// SingleSwapToken deployed to 0x103416cfCD0D0a32b904Ab4fb69dF6E5B5aaDf2b
// swapMultiHop deployed to 0x1F585372F116E1055AF2bED81a808DDf9638dCCD

import booToken from "./BooToken.json";
import lifeToken from "./LifeToken.json";
import singleSwapToken from "./SingleSwapToken.json";
import swapMultiHop from "./SwapMultiHop.json";
import IWETH from "./IWETH.json";
// import userStorgeData from "./UserStorageData.json";



//BOOTOKEN
export const BooTokenAddress = "0xeF66010868Ff77119171628B7eFa0F6179779375";
export const BooTokenABI = booToken.abi;

//LIFE TOken
export const LifeTokenAddress = "0xd544d7A5EF50c510f3E90863828EAba7E392907A";
export const LifeTokenABI = lifeToken.abi;

//SINGLE SWAP TOKEN 
export const SingleSwapTokenAddress =
  "0x103416cfCD0D0a32b904Ab4fb69dF6E5B5aaDf2b";
export const SingleSwapTokenABI = singleSwapToken.abi;

// SWAP MULTIHOP
export const SwapMultiHopAddress = "0x1F585372F116E1055AF2bED81a808DDf9638dCCD";
export const SwapMultiHopABI = swapMultiHop.abi;

//IWETH
export const IWETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const IWETHABI = IWETH.abi;



