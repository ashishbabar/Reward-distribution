// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";

async function main() {
  // Deploy contracts
  const TokenFactory = await ethers.getContractFactory("MyToken");
  const usdtToken = await TokenFactory.deploy(
    "Tether USD",
    "USDT",
    BigNumber.from("1000000000000000000000")
  );
  await usdtToken.deployed();

  const wToken = await TokenFactory.deploy(
    "W Token",
    "WTOK",
    BigNumber.from("1000000000000000000000")
  );

  await wToken.deployed();

  const RewarderFactory = await ethers.getContractFactory("Rewarder");
  const Rewarder = await RewarderFactory.deploy(
    usdtToken.address,
    wToken.address
  );
  await Rewarder.deployed();

  const [A, B, C] = await ethers.getSigners();

  const ATokenAmount = BigNumber.from("10000000000000000000");
  const BTokenAmount = BigNumber.from("90000000000000000000");
  const CTokenAmount = BigNumber.from("100000000000000000000");

  await wToken.transfer(B.address, BigNumber.from("100000000000000000000"));
  await wToken.transfer(C.address, BigNumber.from("100000000000000000000"));

  // Scenario 1
  // Connect to token using A wallet and allow 10 tokens
  await wToken.connect(A).approve(Rewarder.address, ATokenAmount);
  // Call sendWToken to transfer tokens from allowance to rewarder contract's balance
  await Rewarder.connect(A).sendWToken(ATokenAmount);

  // Connect to token using B wallet and allow 90 tokens
  await wToken.connect(B).approve(Rewarder.address, BTokenAmount);
  // Call sendWToken to transfer tokens from allowance to rewarder contract's balance
  await Rewarder.connect(B).sendWToken(BTokenAmount);

  // Connect to C after one day and send 100 tokens
  await wToken.connect(C).approve(Rewarder.address, CTokenAmount);
  await Rewarder.connect(C).sendWToken(CTokenAmount);

  // Contract will receive 1000 USDT today
  const usdtTx = await usdtToken.approve(
    Rewarder.address,
    BigNumber.from("1000000000000000000000")
  );

  await usdtTx.wait();

  await Rewarder.receiveUSDTFunds();

  expect(await usdtToken.balanceOf(Rewarder.address)).to.equal(
    BigNumber.from("1000000000000000000000")
  );

  console.log("Rewarder contract received 1000 USDT tokens!");

  await Rewarder.claimReward();
  await Rewarder.connect(B).claimReward();
  await Rewarder.connect(C).claimReward();

  console.log(
    "USD Balance of A",
    (await usdtToken.balanceOf(A.address)).toString()
  );

  console.log(
    "USD Balance of B",
    (await usdtToken.balanceOf(B.address)).toString()
  );
  console.log(
    "USD Balance of C",
    (await usdtToken.balanceOf(C.address)).toString()
  );

  // Check if A,B and C has their tokens recorded in rewarder contract balance map
  const ADeposit = await Rewarder.UserWTokenDeposits(A.address);
  const BDeposit = await Rewarder.UserWTokenDeposits(B.address);
  const CDeposit = await Rewarder.UserWTokenDeposits(C.address);

  expect(ATokenAmount).to.equal(ADeposit.depositAmount);
  expect(BTokenAmount).to.equal(BDeposit.depositAmount);
  expect(CTokenAmount).to.equal(CDeposit.depositAmount);

  console.log("Scenario 2 users actions completed!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
