import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import PreSaleAbi from "../contractsData/Presale.json";
import PreSaleAddress from "../contractsData/Presale-address.json";

// import { create as ipfsHttpClient } from 'ipfs-http-client'
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endtime,setEndTime] = useState();
  const [maxNftPerAddress,setmaxNftPerAddress] = useState();
  const [maxPreSaleNft,setmaxPreSaleNft] = useState();
  const [supply,setSupply] = useState();
  const [listingFees,setMintingFees] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const presaleNft = new ethers.Contract(
    PreSaleAddress.address,
    PreSaleAbi.abi,
    signer
  );
 
   
  const GrantRole = async () => {
    const MintHash = await nft.MINTER_ROLE();
    await (await nft.grantRole(MintHash, PreSaleAddress.address)).wait();
  };

  const setParam = async () => {
    await (await presaleNft.setParam(endtime,maxNftPerAddress,maxPreSaleNft,supply,listingFees)).wait();
  };
   const MintNft = async()=>{
    await(await presaleNft.mintToken({value:listingFees})).wait();
   }
  return (
    <>
      <div className="container-fluid mt-5">
        <h1>List Nft</h1>
        <div className="row">
          <main
            role="main"
            className="col-lg-3 mx-auto"
            style={{ maxWidth: "1000px" }}
          >
            <div className="content mx-auto">
              <Row className="g-4">
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  size="lg"
                  required
                  type="text"
                  placeholder="Name"
                />
                <Form.Control
                  onChange={(e) => setDescription(e.target.value)}
                  size="lg"
                  required
                  as="textarea"
                  placeholder="Description"
                />
                <Form.Control
                  onChange={(e) => setPrice(e.target.value)}
                  size="lg"
                  required
                  type="number"
                  placeholder="Price in ETH"
                />
                <div className="d-grid px-0">
                  <Button onClick={MintNft} variant="primary" size="lg">
                    Mint & List NFT!
                  </Button>
                  <br />
                  <Button onClick={GrantRole} variant="primary" size="lg">
                    GrantRole
                  </Button>
                </div>
              </Row>
            </div>
          </main>
        </div>
      </div>

      <div className="container-fluid mt-5">
        <h1>Parameters</h1>
        <div className="row">
          <main
            role="main"
            className="col-lg-3 mx-auto"
            style={{ maxWidth: "500px" }}
          >
            <div className="content mx-auto">
              <Row className="g-3">
                <Form.Control
                  onChange={(e) => setEndTime(e.target.value)}
                  size="lg"
                  required
                  type="number"
                  placeholder="endtime"
                />
                <Form.Control
                  onChange={(e) => setmaxNftPerAddress(e.target.value)}
                  size="lg"
                  required
                  type="number"
                  placeholder="NFT Per Address"
                />
                <Form.Control
                  onChange={(e) => setmaxPreSaleNft(e.target.value)}
                  size="lg"
                  required
                  type="number"
                  placeholder="NFT PER SESSION"
                />
                <Form.Control
                  onChange={(e) => setSupply(e.target.value)}
                  size="lg"
                  required
                  type="number"
                  placeholder="Total Supply"
                />
                 <Form.Control
                  onChange={(e) => setMintingFees(e.target.value)}
                  size="lg"
                  required
                  type="number"
                  placeholder="Minting Fees"
                />
                <div className="d-grid px-0">
                  <Button onClick={setParam} variant="primary" size="lg">
                    Set Parameter
                  </Button>
                </div>
              </Row>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Create;
