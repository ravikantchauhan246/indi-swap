// const hre = require("hardhat");

// async function main() {
//   // ERC20 BOO TOKEN
//   const BooToken = await hre.ethers.getContractFactory("BooToken");
//   const booToken = await BooToken.deploy();
//   await booToken.deployTransaction.wait();
//   console.log("Boo Token deployed to:", booToken.address);

//   // ERC20 LIFE TOKEN
//   const LifeToken = await hre.ethers.getContractFactory("LifeToken");
//   const lifeToken = await LifeToken.deploy();
//   await lifeToken.deployTransaction.wait();
//   console.log("Life Token deployed to:", lifeToken.address);

//   // SINGLE SWAP TOKEN
//   const SingleSwapToken = await hre.ethers.getContractFactory(
//     "SingleSwapToken"
//   );
//   const singleSwapToken = await SingleSwapToken.deploy();
//   await singleSwapToken.deployTransaction.wait();
//   console.log("Single Swap Token deployed to:", singleSwapToken.address);

//   // SWAP MULTI HOP
//   const SwapMultiHop = await hre.ethers.getContractFactory("SwapMultiHop");
//   const swapMultiHop = await SwapMultiHop.deploy();
//   await swapMultiHop.deployTransaction.wait();
//   console.log("Swap Multi Hop deployed to:", swapMultiHop.address);

//   // USER DATA CONTRACT
//   const UserStorageData = await hre.ethers.getContractFactory(
//     "UserStorageData"
//   );
//   const userStorageData = await UserStorageData.deploy();
//   await userStorageData.deployTransaction.wait();
//   console.log("User Storage Data deployed to:", userStorageData.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("Error deploying contract:", error);
//     process.exit(1);
//   });


const hre = require("hardhat");

async function main() {
  const overrides = {
    maxFeePerGas: hre.ethers.utils.parseUnits('20', 'gwei'),
    maxPriorityFeePerGas: hre.ethers.utils.parseUnits('2', 'gwei'),
  };

  // ERC20 BOO TOKEN
  const BooToken = await hre.ethers.getContractFactory("BooToken");
  const booToken = await BooToken.deploy(overrides);
  await booToken.deployTransaction.wait();
  console.log("Boo Token deployed to:", booToken.address);

  // ERC20 LIFE TOKEN
  const LifeToken = await hre.ethers.getContractFactory("LifeToken");
  const lifeToken = await LifeToken.deploy(overrides);
  await lifeToken.deployTransaction.wait();
  console.log("Life Token deployed to:", lifeToken.address);

  // SINGLE SWAP TOKEN
  const SingleSwapToken = await hre.ethers.getContractFactory("SingleSwapToken");
  const singleSwapToken = await SingleSwapToken.deploy(overrides);
  await singleSwapToken.deployTransaction.wait();
  console.log("Single Swap Token deployed to:", singleSwapToken.address);

  // SWAP MULTI HOP
  const SwapMultiHop = await hre.ethers.getContractFactory("SwapMultiHop");
  const swapMultiHop = await SwapMultiHop.deploy(overrides);
  await swapMultiHop.deployTransaction.wait();
  console.log("Swap Multi Hop deployed to:", swapMultiHop.address);

  // USER DATA CONTRACT
  const UserStorageData = await hre.ethers.getContractFactory("UserStorageData");
  const userStorageData = await UserStorageData.deploy(overrides);
  await userStorageData.deployTransaction.wait();
  console.log("User Storage Data deployed to:", userStorageData.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
