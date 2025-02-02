const {expect} = require("chai");
const {ethers} = require("hardhat");

const DAI ="0x2bcAE8205a77dabB2479CF2c85ded7d963101B86";

const WETH9 = "OxEF1DACBce5194C668BEe55f2ca599F366709db0C";

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";


describe("SingleSwapToken",()=>{
    let singleSwapToken;
    let weth;
    let dai;
    let usdc;

    before(async()=>{
        account  = await ethers.getSigners(1);
        const SingleSwapToken = await ethers.getContractFactory("SingleSwapToken");
        singleSwapToken = await SingleSwapToken.deploy();

        await singleSwapToken.deployed();

        weth = await ethers.getContractAt("IWETH",WETH9);
        dai = await ethers.getContractAt("IERC20",DAI);
        usdc = await ethers.getContractAt("IERC20",USDC);

        console.log(weth);
        console.log(dai);
        console.log(usdc);  
    })
})
