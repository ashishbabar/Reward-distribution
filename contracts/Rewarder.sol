//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
struct Deposits {
    uint256 depositAmount;
    uint256 depositTime;
    uint256 lastClaimTime;
}

contract Rewarder {
    uint256 public constant dailyUSDTFunds = 1000;
    uint256 public constant dailyUSDTFundsInDecimals = dailyUSDTFunds * 10**18;
    uint256 public totalDeposits;
    uint256 public usdtDepositTimestamp;

    IERC20 public usdToken;
    IERC20 public wToken;

    mapping(address => Deposits) public UserWTokenDeposits;

    constructor(address _usdTokenAddress, address _wTokenAddress) {
        usdToken = IERC20(_usdTokenAddress);
        wToken = IERC20(_wTokenAddress);
    }

    function sendWToken(uint256 amount) public {
        require(
            wToken.allowance(msg.sender, address(this)) >= amount,
            "Insufficient amount!"
        );
        // Transfer funds from approver to this contract
        wToken.transferFrom(msg.sender, address(this), amount);

        // Instantiate storage for user deposit information
        Deposits storage userDeposit = UserWTokenDeposits[msg.sender];
        userDeposit.depositAmount += amount;
        userDeposit.depositTime = block.timestamp;

        // Increase total deposits
        totalDeposits += amount;
    }

    function receiveUSDTFunds() public {
        // Check if msg sender have already
        require(
            usdToken.allowance(msg.sender, address(this)) >=
                dailyUSDTFundsInDecimals,
            "Insufficient amount!"
        );
        usdToken.transferFrom(
            msg.sender,
            address(this),
            dailyUSDTFundsInDecimals
        );
        usdtDepositTimestamp = block.timestamp;
    }

    function claimReward() public {
        // Retrieve user deposits from storage
        Deposits storage userDeposit = UserWTokenDeposits[msg.sender];
        // Check if user last claimed timestamp is older than usdt deposit timestamp
        require(
            userDeposit.lastClaimTime < usdtDepositTimestamp,
            "Reward already claimed!"
        );
        // Calculate claimable tokens
        uint256 claimableTokens = ((userDeposit.depositAmount) *
            (dailyUSDTFunds * (10**2))) / (totalDeposits * (10**2));
        // Transfer claimable tokens to user
        usdToken.transfer(msg.sender, claimableTokens);
        // Update user claim time in storage
        userDeposit.lastClaimTime = block.timestamp;
    }
}
