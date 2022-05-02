import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { CudosAccessControls } from "../typechain/CudosAccessControls";
import { Gravity } from "../typechain/Gravity";
import { TestERC20A } from "../typechain/TestERC20A";

import { deployContracts } from "../test-utils";
import {

  examplePowers
} from "../test-utils/pure";

chai.use(solidity);
const { expect } = chai;

describe("Withdraw ERC20 Bridge Tests", function() {


  let cudosAccessControl:any
  let gravityInstance: Gravity
  let testERC20Instance: TestERC20A
  let amountToTrasnfer:any
  

  beforeEach(async () => {
    const CudosAccessControls = await ethers.getContractFactory("CudosAccessControls");
    cudosAccessControl = (await CudosAccessControls.deploy());

	const signers = await ethers.getSigners();
	const gravityId = ethers.utils.formatBytes32String("foo");
	// This is the power distribution on the Cosmos hub as of 7/14/2020
	let powers = examplePowers();
	let validators = signers.slice(0, powers.length);
	const powerThreshold = 6666;
	const {
		gravity,
		testERC20,
		checkpoint: deployCheckpoint
	  } = await deployContracts(gravityId, powerThreshold, validators, powers, cudosAccessControl.address);

	  gravityInstance = gravity
	  testERC20Instance = testERC20
	
	amountToTrasnfer = ethers.BigNumber.from(100)
	await testERC20Instance.transfer(gravityInstance.address, amountToTrasnfer);
  });


  it("deployer should have admin role", async function() {

	const signers = await ethers.getSigners();
	const hasRole = await cudosAccessControl.hasAdminRole(signers[0].address)
	expect(hasRole).to.be.true;
  });

  it("the cudosAccessControl address would be set properly", async function() {
	const accessControlAddress = await gravityInstance.cudosAccessControls();

	expect(cudosAccessControl.address).to.be.equal(accessControlAddress)
  })

  it("should be able to withdraw ERC20 tokens from the bridge", async function() {

	const signers = await ethers.getSigners();
	let initialBridgeBalance = await testERC20Instance.balanceOf(gravityInstance.address);
	let initialUserBalance = await testERC20Instance.balanceOf(signers[0].address);

	await gravityInstance.withdrawERC20(testERC20Instance.address)

	let finalBridgeBalance = await testERC20Instance.balanceOf(gravityInstance.address);
	let finalUserBalance = await testERC20Instance.balanceOf(signers[0].address);

	expect(finalUserBalance.toNumber(), "final user balance is not greater than the initial").to.be.greaterThan(initialUserBalance.toNumber());
	expect(finalBridgeBalance.toNumber(), "final bridge balance is not less than the initial").to.be.lessThan(initialBridgeBalance.toNumber());
	expect(finalUserBalance.toNumber(),"final user balance is not correct").to.equal((initialUserBalance.add(amountToTrasnfer)).toNumber());
	expect(finalBridgeBalance.toNumber(), "final bridge balance is not correct").to.equal(0);

  })

  it("should throw if non admin tries to withdraw", async function() {
	const signers = await ethers.getSigners();

	await expect(
		 gravityInstance.connect(signers[1]).withdrawERC20(testERC20Instance.address)
	  ).to.be.revertedWith(
		"Recipient is not an admin"
	  );
  })


});
