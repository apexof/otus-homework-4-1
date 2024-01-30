import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const etherscanApiKey = 'Q7Z4WD8J8YVAPXZ5EG5ETKJYPN5VAA5W73'
const privateKey1 = 'e0a9b41fbd7cca2807398c3dd34be160f69f50500410b9cb7501f07207406dfa'
const infuraKey = '84bb3980e1604ce4b8582ce33e87465d'

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraKey}`,
      accounts: [privateKey1]
    }
  },
  etherscan: {  
    apiKey: etherscanApiKey
  }
};

export default config;
