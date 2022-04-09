import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

describe("Rewarder", function () {
  let RewarderFactory: ContractFactory;
  let TokenFactory: ContractFactory;
  let usdtToken: Contract;
  let wToken: Contract;
  let Rewarder: Contract;

  this.beforeEach(async () => {
    TokenFactory = await ethers.getContractFactory("MyToken");
    usdtToken = await TokenFactory.deploy(
      "Tether USD",
      "USDT",
      "1000000000000000000000"
    );
    wToken = await TokenFactory.deploy(
      "W Token",
      "WTOK",
      "1000000000000000000000"
    );

    RewarderFactory = await ethers.getContractFactory("Rewarder");
    Rewarder = await RewarderFactory.deploy(usdtToken.address, wToken.address);
    await Rewarder.deployed();
  });
  it("Should deploy contracts and allow tokens to rewarder contract", async function () {
    await wToken.approve(Rewarder.address, "10000000000000000000");
    await wToken.increaseAllowance(Rewarder.address, "10000000000000000000");

    await Rewarder.sendWToken("10000000000000000000");
    await Rewarder.sendWToken("10000000000000000000");

    const rewarderWTokenBalance = await wToken.balanceOf(Rewarder.address);

    expect(rewarderWTokenBalance).to.equal("20000000000000000000");
  });
});
