import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

const listingPrice='0.5';
const tokenPrice = ethers.utils.parseEther(listingPrice);

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        // get uri url from nft contract
        //const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
       // const response = await fetch(uri)
       // const metadata = await response.json()
        // get total price of item (item price + fee)
        // Add item to items array
        items.push({
          price: "0.5",
          itemId: item.itemId,
          tokenId:item.tokenId,
          seller: item.seller,
          name:"Bored Lazy Monkey",
          description:"This Monkey Can Code too",
          image:  <img 
          src="https://news.artnet.com/app/news-upload/2021/08/Yuga-Labs-Bored-Ape-Yacht-Club-7940.jpg"
          alt="https://news.artnet.com/app/news-upload/2021/08/Yuga-Labs-Bored-Ape-Yacht-Club-7940.jpg"
          />,
        })        
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    const id = await nft.tokenCount()
    console.log(id.toString());
    
    await (await marketplace.purchaseItem(id, { value: tokenPrice })).wait();
    loadMarketplaceItems()
  }

  useEffect(() => {
  loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={"https://news.artnet.com/app/news-upload/2021/08/Yuga-Labs-Bored-Ape-Yacht-Club-7940.jpg"} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                    <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.utils.formatEther(tokenPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home