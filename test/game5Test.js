const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }
  it("should be a winner using method 1", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    try {
      // good luck
      const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

      let address;
      let wallet;
      while (true) {
        wallet = new Wallet.createRandom().connect(ethers.provider);
        address = wallet.address;
        console.log(parseInt(address, 16) < parseInt(threshold, 16));
        console.log("address:", address);
        if (parseInt(address, 16) < parseInt(threshold, 16)) break;
      }
      const value = ethers.utils.hexZeroPad(ethers.utils.parseEther("1"), 20);
      const defaultSigner = ethers.provider.getSigner();
      const tx = await defaultSigner.sendTransaction({
        to: wallet.address,
        value,
      });
      const balance = await ethers.provider.getBalance(wallet.address);
      console.log("balance:", balance);
      await tx.wait();
      await game.connect(wallet).win();
    } catch (error) {
      console.log(error);
    }

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });


  it("should be a winner using method 2", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    try {
      // good luck
      const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
      let address;
      let signer;
      let index = 0;
      while (true) {
        console.log(index);
        signer = ethers.provider.getSigner(index);
        address = await signer.getAddress();
        console.log(parseInt(address, 16) < parseInt(threshold, 16));
        console.log("address:", address);
        if (parseInt(address, 16) < parseInt(threshold, 16)) break;
        index++;
      }
      await game.connect(signer).win();
    } catch (error) {
      console.log(error);
    }
    assert(await game.isWon(), "You did not win the game");
  });
});
