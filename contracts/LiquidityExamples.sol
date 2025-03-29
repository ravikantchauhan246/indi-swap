// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.7.6;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";

contract LiquidityExamples is IERC721Receiver {
    event PositionMinted(uint256 indexed tokenId);
    
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    uint24 public constant poolFee = 100;
    
    INonfungiblePositionManager public immutable nonfungiblePositionManager;
    
    struct Deposit {
        address owner;
        uint128 liquidity;
        address token0;
        address token1;
    }
    
    mapping(uint => Deposit) public deposits;
    uint public tokenId;
    
    constructor(address _nonfungiblePositionManager) {
        nonfungiblePositionManager = INonfungiblePositionManager(_nonfungiblePositionManager);
    }
    
    function onERC721Received(
        address operator,
        address,
        uint _tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        _createDeposit(operator, _tokenId);
        return this.onERC721Received.selector;
    }
    
    function _createDeposit(address owner, uint _tokenId) internal {
        (, , address token0, address token1, , , , uint128 liquidity, , , , ) = 
            nonfungiblePositionManager.positions(_tokenId);

        deposits[_tokenId] = Deposit({
            owner: owner,
            liquidity: liquidity,
            token0: token0,
            token1: token1
        });
        tokenId = _tokenId;
    }

    function mintNewPosition()
        external
        returns (uint _tokenId, uint128 liquidity, uint amount0, uint amount1)
    {
        uint amount0ToMint = 10 * 1e18;
        uint amount1ToMint = 10 * 1e6;

        TransferHelper.safeApprove(DAI, address(nonfungiblePositionManager), amount0ToMint);
        TransferHelper.safeApprove(USDC, address(nonfungiblePositionManager), amount1ToMint);

        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: DAI,
            token1: USDC,
            fee: poolFee,
            tickLower: TickMath.MIN_TICK,
            tickUpper: TickMath.MAX_TICK,
            amount0Desired: amount0ToMint,
            amount1Desired: amount1ToMint,
            amount0Min: 0,
            amount1Min: 0,
            recipient: address(this),
            deadline: block.timestamp
        });

        (_tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager.mint(params);
        _createDeposit(msg.sender, _tokenId);
        
        emit PositionMinted(_tokenId);

        if (amount0 < amount0ToMint) {
            TransferHelper.safeApprove(DAI, address(nonfungiblePositionManager), 0);
            TransferHelper.safeTransfer(DAI, msg.sender, amount0ToMint - amount0);
        }
        if (amount1 < amount1ToMint) {
            TransferHelper.safeApprove(USDC, address(nonfungiblePositionManager), 0);
            TransferHelper.safeTransfer(USDC, msg.sender, amount1ToMint - amount1);
        }
    }

    function decreaseLiquidity(uint128 liquidity) 
        external 
        returns (uint amount0, uint amount1) 
    {
        require(deposits[tokenId].owner == msg.sender, "Not the owner");
        
        INonfungiblePositionManager.DecreaseLiquidityParams memory params =
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: liquidity,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            });

        (amount0, amount1) = nonfungiblePositionManager.decreaseLiquidity(params);
    }

    function withdrawLiquidity() external {
        require(deposits[tokenId].owner == msg.sender, "Not the owner");
        this.decreaseLiquidity(deposits[tokenId].liquidity);
        
        INonfungiblePositionManager.CollectParams memory params = 
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: msg.sender,
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        nonfungiblePositionManager.collect(params);
    }

    function collectAllFees() external returns (uint256 amount0, uint256 amount1) {
        require(deposits[tokenId].owner == msg.sender, "Not the owner");
        
        INonfungiblePositionManager.CollectParams memory params = 
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: msg.sender,
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        (amount0, amount1) = nonfungiblePositionManager.collect(params);
    }

    function getLiquidity(uint _tokenId) external view returns (uint128) {
        (, , , , , , , uint128 liquidity, , , , ) = nonfungiblePositionManager.positions(_tokenId);
        return liquidity;
    }
}