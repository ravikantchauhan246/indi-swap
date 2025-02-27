const hre = require("hardhat");

async function main() {
  try {
    // ERC20 BOO Token
    const BooToken = await hre.ethers.getContractFactory("BooToken");
    const booToken = await BooToken.deploy();
    await booToken.deployed();
    console.log(`BOO deployed to ${booToken.address}`);

    // ERC20 LIFE TOKEN
    const LifeToken = await hre.ethers.getContractFactory("LifeToken");
    const lifeToken = await LifeToken.deploy();
    await lifeToken.deployed();
    console.log(`Life deployed to ${lifeToken.address}`);

    // SingleSwapToken
    console.log("Deploying SingleSwapToken...");
    const SingleSwapToken = await hre.ethers.getContractFactory("SingleSwapToken");
    const singleSwapToken = await SingleSwapToken.deploy({ gasLimit: 5000000 });
    await singleSwapToken.deployed();
    console.log(`SingleSwapToken deployed to ${singleSwapToken.address}`);

    // SwapMultiHop
    const SwapMultiHop = await hre.ethers.getContractFactory("SwapMultiHop");
    const swapMultiHop = await SwapMultiHop.deploy();
    await swapMultiHop.deployed();
    console.log(`swapMultiHop deployed to ${swapMultiHop.address}`);

    //USER DATA CONTRACT
    //   const UserStorageData = await hre.ethers.getContractFactory(
    //     "UserStorageData"
    //   );

    //   const userStorageData = await UserStorageData.deploy();
    //   await userStorageData.deployed();
    //   console.log(`UserStorageData deployed to ${userStorageData.address}`);

  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exitCode = 1;
});