import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { CudosAccessControls } from "../typechain/CudosAccessControls";

import { deployContracts } from "../test-utils";
import {
  getSignerAddresses,
  makeCheckpoint,
  signHash,
  makeTxBatchHash,
  examplePowers
} from "../test-utils/pure";

chai.use(solidity);
const { expect } = chai;

describe("constructor tests", function() {


  let cudosAccessControl:any

  beforeEach(async () => {
    const CudosAccessControls = await ethers.getContractFactory("CudosAccessControls");
    cudosAccessControl = (await CudosAccessControls.deploy());
  });


  it("throws on malformed valset", async function() {

    const signers = await ethers.getSigners();
    const gravityId = ethers.utils.formatBytes32String("foo");

    // This is the power distribution on the Cosmos hub as of 7/14/2020
    let powers = examplePowers();
    let validators = signers.slice(0, powers.length - 1);

    const powerThreshold = 6666;

    await expect(
      deployContracts(gravityId, powerThreshold, validators, powers,cudosAccessControl.address,)
    ).to.be.revertedWith("Malformed current validator set");
  });

  it("throws on insufficient power", async function() {
    const signers = await ethers.getSigners();
    const gravityId = ethers.utils.formatBytes32String("foo");

    // This is the power distribution on the Cosmos hub as of 7/14/2020
    let powers = examplePowers();
    let validators = signers.slice(0, powers.length);

    const powerThreshold = 666666666;

    await expect(
      deployContracts(gravityId, powerThreshold, validators, powers, cudosAccessControl.address)
    ).to.be.revertedWith(
      "Submitted validator set signatures do not have enough power"
    );
  });

  it("throws on zero address for access control", async function() {
    const signers = await ethers.getSigners();
    const gravityId = ethers.utils.formatBytes32String("foo");
    let zeroAddress = ethers.constants.AddressZero;
    // This is the power distribution on the Cosmos hub as of 7/14/2020
    let powers = examplePowers();
    let validators = signers.slice(0, powers.length);
    const powerThreshold = 6666;
    await expect(
      deployContracts(gravityId, powerThreshold, validators, powers, zeroAddress)
    ).to.be.revertedWith(
      "Access control contract address is incorrect"
    );
  })
});
