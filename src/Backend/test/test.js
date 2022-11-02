const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("MyToken");
    const PreSale = await ethers.getContractFactory("Presale");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const token = await Token.deploy();
    const sale = await PreSale.deploy(token.address);

    await token.deployed();
    await sale.deployed();
    const MintHash = await token.MINTER_ROLE();

    return { Token, token, PreSale, sale, owner, addr1, addr2,MintHash };
  }
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { sale, owner } = await loadFixture(deployTokenFixture);

      expect(await sale.owner()).to.equal(owner.address);
    });

    it("Should not be Called by Any Account other than Owner", async function () {
      const { sale, owner, addr1 } = await loadFixture(deployTokenFixture);

      await expect(
        sale.connect(addr1).setParam(10, 20, 30, 40, 50)
      ).to.be.revertedWith("caller is not the owner");
    });

    it("Should Mint the Nft to function caller", async function () {
      const { sale, owner, addr1, token,MintHash } = await loadFixture(
        deployTokenFixture
      );

      await (await token.grantRole(MintHash, sale.address)).wait();
      expect(await sale.connect(owner).setParam(10, 20, 30, 40, 50));
      expect(await sale.connect(addr1).mintToken({ value: "50" }));
      const ownerbalance = await token.balanceOf(addr1.address);
      expect(await ownerbalance).to.equal(1);
    });


    it("Role Should be Assign to Pre Sale Address", async function () {
      const { sale, owner, addr1, token,MintHash } = await loadFixture(
        deployTokenFixture
      );
      await (await token.grantRole(MintHash, sale.address)).wait();
      const role = await token.hasRole(MintHash, sale.address);
      expect(await role).to.equal(true);
    });
    it("Listing Fees Should be Transfer to Owner Only", async function () {
      const { sale, owner, addr1, token,MintHash } = await loadFixture(
        deployTokenFixture
      );
      await (await token.grantRole(MintHash, sale.address)).wait();
      expect(await sale.connect(owner).setParam(10, 20, 30, 40, 1000));
      expect(await sale.connect(addr1).mintToken({ value: "1000" }));
      expect(await sale.connect(owner).checkBalance()).to.equal(1000);
    });
    it("Should not be Minted by Any Account other than Smart Contract", async function () {
      const { sale, owner, addr1,token,MintHash} = await loadFixture(deployTokenFixture);

      await expect(
        token.connect(addr1).singleMint(addr1.address)
      ).to.be.revertedWith('AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6');
    });
   
  });
});
