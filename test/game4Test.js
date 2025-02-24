const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}
    const signer = ethers.provider.getSigner();
    const addressSigner = await signer.getAddress();

    const tx = await game.write(addressSigner);
    await tx.wait();

    await game.win(addressSigner);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
