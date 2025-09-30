// import { DeployFunction } from "hardhat-deploy/types";
// import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { postDeploy } from "postdeploy";

// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const { deployer } = await hre.getNamedAccounts();
//   const { deploy } = hre.deployments;

//   const chainId = await hre.getChainId();
//   const chainName = hre.network.name;

//   // Deploy MVP PredictionMarket
//   const marketName = "PredictionMarket";
//   const market = await deploy(marketName, {
//     from: deployer,
//     args: [
//       "Will BTC close above $100k this year?",
//       Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // +7 days
//       deployer,
//     ],
//     log: true,
//   });

//   console.log(`${marketName} contract address: ${market.address}`);
//   console.log(`${marketName} chainId: ${chainId}`);
//   console.log(`${marketName} chainName: ${chainName}`);

//   // Generates:
//   //  - <root>/packages/site/abi/PredictionMarketABI.ts
//   //  - <root>/packages/site/abi/PredictionMarketAddresses.ts
//   postDeploy(chainName, marketName);
// };

// export default func;

// func.id = "deploy_fheCounter"; // id required to prevent reexecution
// func.tags = ["FHECounter"];

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { postDeploy } from "postdeploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const chainId = await hre.getChainId();
  const chainName = hre.network.name;

  const contractName = "PredictionMarket";
  const deployed = await deploy(contractName, {
    from: deployer,
    args: [
      "Will BTC close above $100k this year?",
      Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      deployer,
    ],
    log: true,
  });

  console.log(`${contractName} contract address: ${deployed.address}`);
  console.log(`${contractName} chainId: ${chainId}`);
  console.log(`${contractName} chainName: ${chainName}`);

  // ✅ Only run postDeploy when generating frontend artifacts
  postDeploy(chainName, contractName);
};

export default func;

func.id = "deploy_predictionMarket";
func.tags = ["PredictionMarket"];
