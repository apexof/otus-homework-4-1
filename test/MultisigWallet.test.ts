import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MultiSigWallet TS", function() {
  async function deploy() {
    const [owner1, owner2] = await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    const multiSigWallet = await MultiSigWallet.deploy(owner2.address);
    await multiSigWallet.waitForDeployment();

    const TestContract = await ethers.getContractFactory("TestContract");
    const testContract = await TestContract.deploy();
    await testContract.waitForDeployment();

    return { owner1, owner2, multiSigWallet, testContract }
  }

  it("should submit and execute a transaction", async function () {
    const { testContract, owner1, owner2, multiSigWallet} = await loadFixture(deploy);
    const testContractAddr = await testContract.getAddress()
    const data = testContract.interface.encodeFunctionData("callMe", [123]);
    
    const {value: txIndex} = await multiSigWallet.addTransaction(testContractAddr, 0, data);
   
    const tx = await multiSigWallet.getTransaction(txIndex);

    expect(tx.to).to.equal(testContractAddr);
    expect(tx.value).to.equal(0);
    expect(tx.data).to.equal(data);
    expect(tx.executed).to.equal(false);
    expect(tx.numConfirmations).to.equal(0);

    await multiSigWallet.connect(owner1).confirmTransaction(txIndex);
    await multiSigWallet.connect(owner2).confirmTransaction(txIndex);

    const initialI = await testContract.i();
    expect(initialI).to.equal(0);

    await multiSigWallet.executeTransaction(txIndex);

    const finalI = await testContract.i();
    expect(finalI).to.equal(123);
  });
});