const hre = require("hardhat");

async function main() {
  const GirlsToken = await hre.ethers.getContractFactory("GirlsToken");
  const girlsToken = await GirlsToken.deploy(100000000, 50);

  await girlsToken.waitForDeployment();

  console.log("Girls Token deployed successfully to: ", await girlsToken.getAddress())
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});