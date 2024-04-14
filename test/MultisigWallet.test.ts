import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const testText = 'text'

describe("MultiSigWallet TS", function() {
  async function deploy() {
    const [owner1, owner2] = await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    const multiSigWallet = await MultiSigWallet.deploy(owner2.address);
    await multiSigWallet.waitForDeployment();

    const StrContract = await ethers.getContractFactory("StrContract");
    const strContract = await StrContract.deploy();
    await strContract.waitForDeployment();

    return { owner1, owner2, multiSigWallet, strContract }
  }

  it("should create tx with correct params", async function () {
    const { strContract, multiSigWallet} = await loadFixture(deploy);
    const testContractAddr = await strContract.getAddress()
    const data = strContract.interface.encodeFunctionData("setStr", [testText]);
    
    const {value: txIndex} = await multiSigWallet.addTransaction(testContractAddr, 0, data);
   
    const tx = await multiSigWallet.getTransaction(txIndex);

    expect(tx.to).to.equal(testContractAddr);
    expect(tx.value).to.equal(0);
    expect(tx.data).to.equal(data);
    expect(tx.executed).to.equal(false);
    expect(tx.numConfirmations).to.equal(0);
  });
  it("initial string should be empty", async function () {
    const { strContract } = await loadFixture(deploy);

    const initialStr = await strContract.str();
    expect(initialStr).to.equal('');
  });
  it("should create tx, set 2 confirmations, execute transaction and check new string", async function () {
    const { strContract, owner2, multiSigWallet} = await loadFixture(deploy);
    const testContractAddr = await strContract.getAddress()
    const data = strContract.interface.encodeFunctionData("setStr", [testText]);
    
    const {value: txIndex} = await multiSigWallet.addTransaction(testContractAddr, 0, data);
   
    await multiSigWallet.confirmTransaction(txIndex);
    await multiSigWallet.connect(owner2).confirmTransaction(txIndex);

    await multiSigWallet.executeTransaction(txIndex);

    const str = await strContract.str();
    expect(str).to.equal(testText);
  });
  it("should reverted when only 1 confirmation", async function () {
    const { strContract,  multiSigWallet} = await loadFixture(deploy);
    const testContractAddr = await strContract.getAddress()
    const data = strContract.interface.encodeFunctionData("setStr", [testText]);
    
    const {value: txIndex} = await multiSigWallet.addTransaction(testContractAddr, 0, data);
    await multiSigWallet.confirmTransaction(txIndex);
    const tx = multiSigWallet.executeTransaction(txIndex);

    await expect(tx).to.be.reverted
  });
});