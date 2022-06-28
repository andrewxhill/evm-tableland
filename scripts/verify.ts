import { run, ethers, upgrades, network, baseURI, proxy } from "hardhat";

async function main() {
  console.log(`\nVerifying on '${network.name}'...`);

  // Get base URI
  if (baseURI === undefined || baseURI === "") {
    throw Error(`missing baseURIs entry for '${network.name}'`);
  }

  // Ensure deployments
  if (proxy === "") {
    throw Error(`no proxy entry for '${network.name}'`);
  }

  // Verify implementation
  const tables = (await ethers.getContractFactory("TablelandTables")).attach(
    proxy
  );
  const impl = await upgrades.erc1967.getImplementationAddress(tables.address);
  await run("verify:verify", {
    address: impl,
    constructorArguments: [baseURI],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});