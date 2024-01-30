import { ethers } from "hardhat";
// import { ERC20Token } from "../typechain-types/contracts/ERC20.sol";
// import { ERC20Token } from "../typechain-types";

async function main() {
  const MyContract = await ethers.getContractFactory("ERC20Token");
  const myContract = await MyContract.deploy('Apexof', 'APEX', 10);

  await myContract.waitForDeployment();
  const address = await myContract.getAddress()

  console.log("MyContract deployed to:", address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
