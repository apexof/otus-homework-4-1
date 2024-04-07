import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200
      },
      // outputSelection: {
      //   "*": {
      //   "": ["ast"],
      //   "*": ["abi", "metadata", "devdoc", "userdoc", "storageLayout", "evm.legacyAssembly", "evm.bytecode", "evm.deployedBytecode", "evm.methodIdentifiers", "evm.gasEstimates", "evm.assembly"]
      //   }
      // }
    }
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY as string]
    },
    polygon_mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY as string]
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY as string]
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_KEY as string, 
      polygon: process.env.POLYGONSCAN_KEY as string,
      polygonMumbai: process.env.POLYGONSCAN_KEY as string
    }
  }
};

export default config;
