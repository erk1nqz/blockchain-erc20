const { expect } = require("chai");
const hre = require("hardhat");

describe("GirlsToken contract", function() {
  // global vars
  let Token;
  let girlsToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("GirlsToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    girlsToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await girlsToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await girlsToken.balanceOf(owner.address);
      expect(await girlsToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await girlsToken.cap();
      const val = hre.ethers.formatEther(cap);
      expect(Number(val)).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await girlsToken.blockReward();
      const reward = hre.ethers.formatEther(blockReward);
      expect(Number(reward)).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await girlsToken.transfer(addr1.address, 50);
      const addr1Balance = await girlsToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await girlsToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await girlsToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await girlsToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await girlsToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await girlsToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await girlsToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(150));

      const addr1Balance = await girlsToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await girlsToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
  
});