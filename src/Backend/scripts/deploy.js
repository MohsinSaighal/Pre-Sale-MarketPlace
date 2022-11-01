const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  
  // Get the ContractFactories and Signers here.
  const NFT = await ethers.getContractFactory("MyToken");
  const preSale = await ethers.getContractFactory("Presale")
  const Marketplace = await ethers.getContractFactory("NftMarketplace");
  // deploy contracts
  const marketplace = await Marketplace.deploy();
  const nft = await NFT.deploy();
  const preSaleNft = await preSale.deploy(nft.address);
  console.log("NFT contract deployed to",nft.address)
  console.log("Marketplace contract deployed to",marketplace.address)
  console.log("Pre Sale contract deployed to",preSaleNft.address);
  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(marketplace , "NftMarketplace");
  saveFrontendFiles(nft , "MyToken");
  saveFrontendFiles(preSaleNft , "Presale");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
  //nft -0xB224102C309ee23FA9E39A37647E99d42A632bcE
 //market-place 0x41de30D3693C9701a6aC0f181a4DaDAF5966b45C