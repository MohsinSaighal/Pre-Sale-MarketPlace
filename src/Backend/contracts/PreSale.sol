// SPDX-License-Identifier: GPL-3.0

 pragma solidity >=0.7.0 <0.9.0;

 import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
 import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
 import "@openzeppelin/contracts/access/Ownable.sol";
 import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
 import "./IMyToken.sol";
/** 
 * @title PreSaleNft
 * @dev Pre Nft Access to  Users
 */

 contract Presale is Ownable,ReentrancyGuard {

   IMyToken public nft;

     uint256 public starttime;
     uint256 public endtime;
     uint256 public maxNftPerAddress;
     uint256 public maxPreSaleNft;
     uint256 public supply;
     uint256 public listingFees;
     uint256 public nftCount;
     uint256 public totalNft;
     uint256 public totalSupply;
   
   mapping (address => uint256)public nftminted;
   constructor (IMyToken _nft) {
     nft = _nft;
   }
   

   function mintToken() public payable nonReentrant {
     totalNft++;
     totalSupply++;
     require(endtime >=block.timestamp,"Pre Sale Ended");
     require(totalNft <=maxPreSaleNft,"max mint amount per session exceeded");
     require(supply >= totalSupply,"Total Supply Limit Exceeded");
     nftminted[msg.sender]++;
     nftCount = nftminted[msg.sender];
     require(nftCount<=maxNftPerAddress,"Your Minting Limit exceeded");
     require(msg.value >= listingFees,"Please Pay Full Listing Fees");
     payable(owner()).transfer(listingFees);
     nft.singleMint(msg.sender);     
   }

   function setParam(uint256 _endtime,uint256 _maxNftPerAddress,uint256 _maxPreSaleNft,uint256 _supply,uint256 _listingFees)public onlyOwner()

   {
    starttime = block.timestamp;
    endtime  = block.timestamp + (_endtime * 60);
    maxNftPerAddress = _maxNftPerAddress;
    maxPreSaleNft = _maxPreSaleNft;
    supply = _supply;
    listingFees = _listingFees;
   }

 }
