import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'

const listingPrice='0.5';
const tokenPrice = ethers.utils.parseEther(listingPrice);
export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const loadPurchasedItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  marketplace.filters.ItemBought(account,null,null,null)
    const results = await marketplace.queryFilter(filter)
    const id = await nft.tokenCount()
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      //const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      //const response = await fetch(uri)
      //const metadata = await response.json()
      // get total price of item (item price + fee)
     // const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = {
        price: tokenPrice,
        itemId: id,
        name: "Bored Lazy Monkey",
        description: "A Monkey who can code",
        image: ""
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }

  // ghfgdshg
  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={"https://news.artnet.com/app/news-upload/2021/08/Yuga-Labs-Bored-Ape-Yacht-Club-7940.jpg"} />
                  <Card.Footer>{ethers.utils.formatEther(item.price)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No purchases</h2>
          </main>
        )}
    </div>
  );
}