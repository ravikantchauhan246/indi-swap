const { expect } = require("chai");
const { ethers } = require("hardhat");

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI_WHALE = "0x075e72a5eDf65F0A5f44699c7654C1a76941Ddc8";
const USDC_WHALE = "0x55FE002aefF02F77364de339a1292923A15844B8";
const NONFUNGIBLE_POSITION_MANAGER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

describe("Liquidity", function () {
  let liquidity;
  let owner;
  let dai, usdc;

  before(async function () {
    [owner] = await ethers.getSigners();

    // Fund owner with ETH
    await network.provider.send("hardhat_setBalance", [
      owner.address,
      ethers.utils.parseEther("100.0").toHexString(),
    ]);

    // Deploy contract
    const Liquidity = await ethers.getContractFactory("LiquidityExamples");
    liquidity = await Liquidity.deploy(NONFUNGIBLE_POSITION_MANAGER);
    await liquidity.deployed();

    // Get token contracts
    dai = await ethers.getContractAt("IERC20", DAI);
    usdc = await ethers.getContractAt("IERC20", USDC);

    // Impersonate whales
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_WHALE],
    });

    // Fund whales with ETH for gas
    await network.provider.send("hardhat_setBalance", [
      DAI_WHALE,
      ethers.utils.parseEther("100.0").toHexString(),
    ]);
    await network.provider.send("hardhat_setBalance", [
      USDC_WHALE,
      ethers.utils.parseEther("100.0").toHexString(),
    ]);

    const daiWhale = await ethers.getSigner(DAI_WHALE);
    const usdcWhale = await ethers.getSigner(USDC_WHALE);

    // Transfer tokens to contract
    const daiAmount = ethers.utils.parseEther("10"); // Reduced from 100
    const usdcAmount = ethers.utils.parseUnits("10", 6); // Reduced from 100
    
    await dai.connect(daiWhale).transfer(liquidity.address, daiAmount);
    await usdc.connect(usdcWhale).transfer(liquidity.address, usdcAmount);
  });

  it("should mint new position", async function () {
    // Verify contract balances
    const contractDaiBalance = await dai.balanceOf(liquidity.address);
    const contractUsdcBalance = await usdc.balanceOf(liquidity.address);
    
    console.log(`Contract DAI Balance: ${ethers.utils.formatEther(contractDaiBalance)}`);
    console.log(`Contract USDC Balance: ${ethers.utils.formatUnits(contractUsdcBalance, 6)}`);

    // Mint new position
    const tx = await liquidity.mintNewPosition();
    const receipt = await tx.wait();

    // Verify our custom event was emitted
    const event = receipt.events?.find(e => e.event === "PositionMinted");
    expect(event).to.not.be.undefined;
    expect(event.args.tokenId.toString()).to.match(/^\d+$/); // Verify it's a number
    
    console.log(`Successfully minted position with tokenId: ${event.args.tokenId}`);
  });
});