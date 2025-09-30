// import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * PredictionMarket task helpers
 *
 * Examples (localhost):
 *   - npx hardhat --network localhost market:address
 *   - npx hardhat --network localhost market:get-my-stake --outcome 1
 *   - npx hardhat --network localhost market:get-total --outcome 0
 *   - npx hardhat --network localhost market:place-bet --outcome 1 --amount 5
 *   - npx hardhat --network localhost market:resolve --outcome 1
 */

task("market:address", "Prints the PredictionMarket address").setAction(
  async function (_taskArguments: TaskArguments, hre) {
    const { deployments } = hre;
    const d = await deployments.get("PredictionMarket");
    console.log("PredictionMarket address is " + d.address);
  }
);

task("market:get-my-stake", "Calls getMyStake(outcome) and prints the encrypted handle")
  .addParam("outcome", "Outcome id: 0=NO, 1=YES")
  .addOptionalParam("address", "Optionally specify the PredictionMarket contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const outcome = parseInt(taskArguments.outcome);
    if (!(outcome === 0 || outcome === 1)) {
      throw new Error(`--outcome must be 0 or 1`);
    }

    const deployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get("PredictionMarket");

    const market = await ethers.getContractAt(
      "PredictionMarket",
      deployment.address
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enc = await (market as any).getMyStake(outcome);
    console.log(`Encrypted stake (outcome=${outcome}): ${enc}`);
  });

task("market:get-total", "Calls getEncryptedTotal(outcome) and prints the encrypted handle")
  .addParam("outcome", "Outcome id: 0=NO, 1=YES")
  .addOptionalParam("address", "Optionally specify the PredictionMarket contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const outcome = parseInt(taskArguments.outcome);
    if (!(outcome === 0 || outcome === 1)) {
      throw new Error(`--outcome must be 0 or 1`);
    }

    const deployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get("PredictionMarket");

    const market = await ethers.getContractAt(
      "PredictionMarket",
      deployment.address
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enc = await (market as any).getEncryptedTotal(outcome);
    console.log(`Encrypted total (outcome=${outcome}): ${enc}`);
  });

task("market:place-bet", "Encrypts amount and calls placeBet(outcome, enc, proof)")
  .addParam("outcome", "Outcome id: 0=NO, 1=YES")
  .addParam("amount", "Amount to bet (integer)")
  .addOptionalParam("address", "Optionally specify the PredictionMarket contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const outcome = parseInt(taskArguments.outcome);
    if (!(outcome === 0 || outcome === 1)) {
      throw new Error(`--outcome must be 0 or 1`);
    }
    const amount = parseInt(taskArguments.amount);
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error(`--amount must be a positive integer`);
    }

    await fhevm.initializeCLIApi();

    const deployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get("PredictionMarket");

    const [signer] = await ethers.getSigners();

    // Encrypt amount with 128-bit input
    const encrypted = await fhevm
      .createEncryptedInput(deployment.address, signer.address)
      .add128(amount)
      .encrypt();

    const market = await ethers.getContractAt(
      "PredictionMarket",
      deployment.address
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tx = await (market as any)
      .connect(signer)
      .placeBet(outcome, encrypted.handles[0], encrypted.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);
  });

task("market:resolve", "Resolves the market to outcome (oracle only)")
  .addParam("outcome", "Outcome id: 0=NO, 1=YES")
  .addOptionalParam("address", "Optionally specify the PredictionMarket contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const outcome = parseInt(taskArguments.outcome);
    if (!(outcome === 0 || outcome === 1)) {
      throw new Error(`--outcome must be 0 or 1`);
    }

    const deployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get("PredictionMarket");

    const [signer] = await ethers.getSigners();
    const market = await ethers.getContractAt(
      "PredictionMarket",
      deployment.address
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tx = await (market as any).connect(signer).resolve(outcome);
    console.log(`Wait for tx:${tx.hash}...`);
    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);
  });


