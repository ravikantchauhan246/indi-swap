// Token address
shoaibAddress = "0x9581c795DBcaf408E477F6f1908a41BE43093122";
rayyanAddress = "0x3CA5269B5c54d4C807Ca0dF7EeB2CB7a5327E77d";
spopupAddress = "0x8a6E9a8E0bB561f8cdAb1619ECc4585aaF126D73";

// Uniswap contract address
wethAddress = "0x012D720e7d2E84b24b68989e0f4aD824fE5B294C";
factoryAddress = "0xA4f9885550548c6a45b9D18C57B114c06f3c39B8";
swapRouterAddress = "0x886a2A3ABF5B79AA5dFF1C73016BD07CFc817e04";
nftDescriptorAddress = "0x449C286Ab90639fd9F6604F4f15Ec86bce2b8A61";
positionDescriptorAddress = "0x5E0399B4C3c4C31036DcA08d53c0c5b5c29C113e";
positionManagerAddress = "0x512a0E8bAeb6Ac3D52A11780c92517627005b0b1";

// Pool address
SHO_RAY = "0x90C780e95a2628dA0FcC006A21aa48F0a0AD7fFE";

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  Shoaib: require("../artifacts/contracts/Shoaib.sol/Shoaib.json"),
  Rayyan: require("../artifacts/contracts/Rayyan.sol/Rayyan.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}

async function main() {
  const [owner] = await ethers.getSigners();
  const provider = waffle.provider;

  const ShoaibContract = new Contract(
    shoaibAddress,
    artifacts.Shoaib.abi,
    provider
  );
  const RayyanContract = new Contract(
    rayyanAddress,
    artifacts.Rayyan.abi,
    provider
  );

  await ShoaibContract.connect(owner).approve(
    positionManagerAddress,
    ethers.utils.parseEther("1000")
  );

  await RayyanContract.connect(owner).approve(
    positionManagerAddress,
    ethers.utils.parseEther("1000")
  );

  const poolContract = new Contract(
    SHO_RAY,
    artifacts.UniswapV3Pool.abi,
    provider
  );

  const poolData = await getPoolData(poolContract);

  const ShoaibToken = new Token(31337, shoaibAddress, 18, "Shoaib", "Tether");

  const RayyanToken = new Token(
    31337,
    rayyanAddress,
    18,
    "Rayyan",
    "Rayyanoin"
  );

  const pool = new Pool(
    ShoaibToken,
    RayyanToken,
    poolData.fee,
    poolData.sqrtPriceX96.toString(),
    poolData.liquidity.toString(),
    poolData.tick
  );

  const position = new Position({
    pool: pool,
    liquidity: ethers.utils.parseEther("1"),
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
  });

  const { amount0: amount0Desired, amount1: amount1Desired } =
    position.mintAmounts;

  params = {
    token0: shoaibAddress,
    token1: rayyanAddress,
    fee: poolData.fee,
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
    amount0Desired: amount0Desired.toString(),
    amount1Desired: amount1Desired.toString(),
    amount0Min: 0,
    amount1Min: 0,
    recipient: owner.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  };

  const nonfungiblePositionManager = new Contract(
    positionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider
  );

  const balanceShoaib = await ShoaibContract.balanceOf(owner.address);
  const balanceRayyan = await RayyanContract.balanceOf(owner.address);

  console.log("Shoaib balance:", balanceShoaib.toString());
  console.log("Rayyan balance:", balanceRayyan.toString());

  const tx = await nonfungiblePositionManager
    .connect(owner)
    .mint(params, { gasLimit: "1000000" });

  const receipt = await tx.wait();
  console.log("receipt", receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
