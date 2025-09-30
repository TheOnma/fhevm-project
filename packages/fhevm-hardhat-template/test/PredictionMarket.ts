/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PredictionMarket (MVP)", function () {
  async function deployFixture() {
    const [deployer, other] = await ethers.getSigners();

    const now = await ethers.provider.getBlock("latest");
    const endTime = (now!.timestamp ?? Math.floor(Date.now() / 1000)) + 3600; // +1h

    const Market = await ethers.getContractFactory("PredictionMarket");
    const market = await Market.deploy(
      "Will BTC close above $100k this year?",
      endTime,
      await deployer.getAddress()
    );

    await market.waitForDeployment();

    return { market, deployer, other, endTime };
  }

  it("deploys and initializes", async () => {
    const { market } = await deployFixture();
    const m = market as unknown as any;
    expect(await m.question()).to.be.a("string");
    expect(await m.resolved()).to.equal(false);
  });

  it("returns zero handles before any bet", async () => {
    const { market } = await deployFixture();
    const m = market as unknown as any;
    const zeroHash = ethers.ZeroHash;
    const yes = await m.getMyStake(1);
    const no = await m.getMyStake(0);
    const totYes = await m.getEncryptedTotal(1);
    const totNo = await m.getEncryptedTotal(0);
    expect(yes).to.equal(zeroHash);
    expect(no).to.equal(zeroHash);
    expect(totYes).to.equal(zeroHash);
    expect(totNo).to.equal(zeroHash);
  });

  it("getter reverts on invalid outcome", async () => {
    const { market } = await deployFixture();
    const m = market as unknown as any;
    await expect(m.getMyStake(2)).to.be.revertedWithCustomError(
      market as any,
      "InvalidOutcome"
    );
    await expect(m.getEncryptedTotal(3)).to.be.revertedWithCustomError(
      market as any,
      "InvalidOutcome"
    );
  });

  it("resolve guards: only oracle and after endTime", async () => {
    const { market, other } = await deployFixture();
    const m = market as unknown as any;

    await expect(m.connect(other).resolve(1)).to.be.revertedWithCustomError(
      market as any,
      "NotOracle"
    );

    // Before endTime
    await expect(m.resolve(1)).to.be.revertedWithCustomError(
      market as any,
      "MarketClosed"
    );
  });

  it("resolves after endTime", async () => {
    const { market, endTime } = await deployFixture();
    const m = market as unknown as any;

    // Move time forward beyond endTime
    await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 1]);
    await ethers.provider.send("evm_mine", []);

    await expect(m.resolve(1)).to.emit(market as any, "Resolved").withArgs(1);
    expect(await m.resolved()).to.equal(true);
    expect(await m.resolvedOutcome()).to.equal(1);

    // Cannot resolve twice
    await expect(m.resolve(0)).to.be.revertedWithCustomError(
      market as any,
      "AlreadyResolved"
    );
  });

  it("placeBet reverts after market closed (no encryption required to test guard)", async () => {
    const { market, endTime } = await deployFixture();
    const m = market as unknown as any;

    // Move time forward beyond endTime so _requireOpen reverts first
    await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 1]);
    await ethers.provider.send("evm_mine", []);

    await expect(m.placeBet(1, ethers.ZeroHash, "0x")).to.be.revertedWithCustomError(
      market as any,
      "MarketClosed"
    );
  });
});


