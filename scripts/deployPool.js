// Token address
shoaibAddress= '0x162700d1613DfEC978032A909DE02643bC55df1A';
rayyanAddress= '0x67aD6EA566BA6B0fC52e97Bc25CE46120fdAc04c';
popupAddress= '0x114e375B6FCC6d6fCb68c7A1d407E652C54F25FB';

// Uniswap contract address
// wethAddress = "0x6B763F54D260aFF608CbbAeD8721c96992eC24Db";
// factoryAddress = "0xF48883F2ae4C4bf4654f45997fE47D73daA4da07";
// swapRouterAddress = "0x226A19c076a3047a53e5430B14bcDB42dbccA159";
// nftDescriptorAddress = "0xA5c9020ea95324a05B48491FB3e61Ba111E5dd95";
// positionDescriptorAddress = "0x093D305366218D6d09bA10448922F10814b031dd";
// positionManagerAddress = "0x061FB3749C4eD5e3c2d28a284940093cfDFcBa20";
wethAddress = "0xc9952Fc93Fa9bE383ccB39008c786b9f94eAc95d";
factoryAddress = "0xDde063eBe8E85D666AD99f731B4Dbf8C98F29708";
swapRouterAddress = "0xD5724171C2b7f0AA717a324626050BD05767e2C6";
nftDescriptorAddress= "0x70eE76691Bdd9696552AF8d4fd634b3cF79DD529";
positionDescriptorAddress= "0x8B190573374637f144AC8D37375d97fd84cBD3a0";
positionManagerAddress= "0x9385556B571ab92bf6dC9a0DbD75429Dd4d56F91";

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const MAINNET_URL =
  "https://eth-mainnet.g.alchemy.com/v2/A1QqJNUZQPujsSLrSHnkIqwlzi1fJb5Z";

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);

function encodePriceSqrt(reserve1, reserve0) {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
}

const nonfungiblePositionManager = new Contract(
  positionManagerAddress,
  artifacts.NonfungiblePositionManager.abi,
  provider
);

const factory = new Contract(
  factoryAddress,
  artifacts.UniswapV3Factory.abi,
  provider
);

async function deployPool(token0, token1, fee, price) {
  const [owner] = await ethers.getSigners();
  await nonfungiblePositionManager
    .connect(owner)
    .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
      gasLimit: 30000000,
    });

  // console.log(nonfungiblePositionManager);
  const poolAddress = await factory.connect(owner).getPool(token0, token1, fee);

  return poolAddress;
}

async function main() {
  const shoRay = await deployPool(
    // shoaibAddress,
    // rayyanAddress,
    // popupAddress,
    rayyanAddress,
    popupAddress,
    500,
    encodePriceSqrt(1, 1)
  );
  // console.log("SHO_RAY=", `'${shoRay}'`);
  console.log("SHO_POP=", `'${shoRay}'`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
