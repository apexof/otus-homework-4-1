import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
// import "@nomicfoundation/hardhat-chai-matchers";
import { ethers } from "hardhat";

const totalSupplyDefault = 10
const amount = 1;
const bigAmount = totalSupplyDefault + amount;

describe("ERC20", function() {
  async function deploy() {
    const [user1, user2] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("ERC20Token");
    const contract = await Factory.deploy(totalSupplyDefault);
    await contract.waitForDeployment();

    return { user1, user2, contract }
  }

  it("should be deployed", async function() {
    const { contract } = await loadFixture(deploy);
    expect(contract.target).to.be.properAddress;
  })
  it(`totalSupply should be ${totalSupplyDefault} by default`, async function() {
    const { contract } = await loadFixture(deploy);
    const totalSupply = await contract.totalSupply();

    expect(totalSupply).to.eq(totalSupplyDefault);
  })
  it(`Should correctly transfer tokens and update balances`, async function() {
    const { contract, user2 } = await loadFixture(deploy);
    await contract.transfer(user2, amount);
    const user2Balance = await contract.balanceOf(user2)

    expect(user2Balance).to.eq(amount);
  })
  it(`Should fail if sender doesn’t have enough tokens`, async function() {
    const { contract, user2, user1 } = await loadFixture(deploy);
    const tx = contract.connect(user2).transfer(user1, amount);
    const user2Balance = await contract.balanceOf(user2)

    await expect(tx).to.be.revertedWithCustomError(contract,"ERC20InsufficientBalance").withArgs(user2.address, user2Balance, amount);
  })
  it(`Should correct burn tokens`, async function() {
    const { contract, user1 } = await loadFixture(deploy);

    // user balance
    const tx = contract.transfer(ethers.ZeroAddress, amount);
    await expect(tx).to.changeTokenBalance(contract,user1, -amount)

    //totalSupply
    const totalSupply = await contract.totalSupply();
    expect(totalSupply).to.eq(totalSupplyDefault - 1); 
  })
  it(`Should correct approve tokens`, async function() {
    const { contract, user1,user2 } = await loadFixture(deploy);

    //allowanceBefore
    const allowanceBefore = await contract.allowance(user1,user2)
    expect(allowanceBefore).to.eq(0); 

    await contract.approve(user2, amount)

    // allowanceAfter
    const allowanceAfter = await contract.allowance(user1,user2)
    expect(allowanceAfter).to.eq(1); 
  })
  it(`Should fail if sender doesn’t have enough allowance for transferFrom tokens`, async function() {
    const { contract, user2, user1 } = await loadFixture(deploy);
    const tx = contract.transferFrom(user2, user1, amount)
    const allowance = await contract.allowance(user2, user1)

    await expect(tx).to.be.revertedWithCustomError(contract, "ERC20InsufficientAllowance").withArgs(user1, allowance, amount);
  })
  it(`Should fail if sender doesn’t have enough tokens for transferFrom`, async function() {
    const { contract, user2, user1 } = await loadFixture(deploy);
    await contract.approve(user2, bigAmount)
    const tx = contract.connect(user2).transferFrom(user1, user2, bigAmount);

    await expect(tx).to.be.revertedWithCustomError(contract, 'ERC20InsufficientBalance')
  })
  it(`Should correctly transferFrom tokens and update balances`, async function() {
    const { contract, user2, user1 } = await loadFixture(deploy);

    await contract.approve(user2, amount)
    const tx = contract.connect(user2).transferFrom(user1, user2, amount);

    await expect(tx).to.be.changeTokenBalances(contract, [user1, user2], [-amount, amount])
  })
  // mint
  it(`Should correctly mint new tokens`, async function() {
    const { contract, user1 } = await loadFixture(deploy);
    const newAmount = 30
    const tx = contract.mint(newAmount)
    await expect(tx).to.be.changeTokenBalance(contract, user1, newAmount)
    const totalSupply = await contract.totalSupply()

    expect(totalSupply).to.be.eq(newAmount + totalSupplyDefault)
  })
  it(`Only owner can mint new tokens`, async function() {
    const { contract, user1, user2 } = await loadFixture(deploy);
    const tx = contract.connect(user2).mint(1)

    await expect(tx).to.be.revertedWith('Only owner can do this!')
  })
});