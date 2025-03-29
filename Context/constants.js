import booToken from "../artifacts/contracts/ERC20Boo.sol/BooToken.json";
import lifeToken from "../artifacts/contracts/ERC20Life.sol/LifeToken.json";
import singleSwapToken from "../artifacts/contracts/SwapToken.sol/SingleSwapToken.json";
import swapMultiHop from "../artifacts/contracts/SwapMultiHop.sol/SwapMultiHop.json";
import IWETH from "../artifacts/contracts/Interfaces/IWETH.sol/IWETH.json";
import userStorageData from "../artifacts/contracts/storeUserData.sol/UserStorageData.json";

export const BooTokenAddress = "0x87006e75a5B6bE9D1bbF61AC8Cd84f05D9140589";
export const BooTokenABI = booToken.abi;

export const LifeTokenAddress = "0x51C65cd0Cdb1A8A8b79dfc2eE965B1bA0bb8fc89";
export const lifeTokenABI = lifeToken.abi;

export const SingleSwapTokenAddress =
"0x8fC8CFB7f7362E44E472c690A6e025B80E406458";
export const SingleSwapTokenABI = singleSwapToken.abi;

export const SwapMultiHopAddress = "0xC7143d5bA86553C06f5730c8dC9f8187a621A8D4";
export const SwapMultiHopABI = swapMultiHop.abi;

export const IWETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const IWETHABI = IWETH.abi;

export const userStorageDataAddress =
  "0x359570B3a0437805D0a71457D61AD26a28cAC9A2";
export const userStorageDataABI = userStorageData.abi;
