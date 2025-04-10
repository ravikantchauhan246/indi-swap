// Token address
shoaibAddress = "0x5aA185fbEFc205072FaecC6B9D564383e761f8C2";
rayyanAddress = "0x63275D081C4A77AE69f76c4952F9747a5559a519";
popupAddress = "0x5A61c51C6745b3F509f4a1BF54BFD04e04aF430a";

// Uniswap contract address
// wethAddress = "0x6B763F54D260aFF608CbbAeD8721c96992eC24Db";
// factoryAddress = "0xF48883F2ae4C4bf4654f45997fE47D73daA4da07";
// swapRouterAddress = "0x226A19c076a3047a53e5430B14bcDB42dbccA159";
// nftDescriptorAddress = "0xA5c9020ea95324a05B48491FB3e61Ba111E5dd95";
// positionDescriptorAddress = "0x093D305366218D6d09bA10448922F10814b031dd";
// positionManagerAddress = "0x061FB3749C4eD5e3c2d28a284940093cfDFcBa20";
wethAddress = "0x012D720e7d2E84b24b68989e0f4aD824fE5B294C";
factoryAddress = "0xA4f9885550548c6a45b9D18C57B114c06f3c39B8";
swapRouterAddress = "0x886a2A3ABF5B79AA5dFF1C73016BD07CFc817e04";
nftDescriptorAddress = "0x449C286Ab90639fd9F6604F4f15Ec86bce2b8A61";
positionDescriptorAddress = "0x5E0399B4C3c4C31036DcA08d53c0c5b5c29C113e";
positionManagerAddress = "0x512a0E8bAeb6Ac3D52A11780c92517627005b0b1";

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const MAINNET_URL =
  "https://eth-mainnet.g.alchemy.com/v2/XbTCI1sk-nWg_2lJu90LU9FjQS6I94qj";

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
