import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from 'axios';
import MyPagination from "../../components/MyPagination";
import { PaginationContext } from "../../context/PaginationContext";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function BidCards(props) {
    let mapped_bids = props.bids.map((bid, index) => {
        return (
            <Card className="text-center" style={{marginTop: "13px"}}>
                <Card.Body>
                    <Card.Title>{bid.amount}</Card.Title>
                    <Card className="text-center">
                        <Card.Header>Προσφοροδότης:</Card.Header>
                        <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Όνομα χρήστη: {bid.bidder.username}</ListGroup.Item>
                            <ListGroup.Item>Αξιολόγηση αγοραστή: {bid.bidder.buyer_rating}</ListGroup.Item> 
                        </ListGroup>
                        </Card.Body>
                        
                    </Card>
                </Card.Body>
                <Card.Footer className="text-muted">Ημερομηνία και ώρα υποβολής προσφοράς: {bid.time}</Card.Footer>
            </Card>
        )
    })

    return (
        <Container>
            {mapped_bids}
        </Container>
    )
}

function ItemBids(props) {
    const { active, setActive } = useContext(PaginationContext);
    const location = useLocation();
    console.log(location.state.id)
    const page_size = 10;
    const [count, setCount] = useState(0)
    const [page_count, setPageCount] = useState(0)
    const [bids, setBids] = useState([])
    const[loaded, setloaded] = useState(null)
    window.scrollTo(0, 0)
    const headers = {
        "Authorization": `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    }
    const data = {}
    const url = 'http://localhost:8000/auctions/' + `${location.state.id}` +'/bids/'

    useEffect(() => {
        axios.get(url, {headers}, data) //get bids for an item with a certain id
            .then((r) => {
                console.log(r.data)
                setCount(r.data.count)
                setPageCount(Math.ceil(r.data.count/page_size))
                setBids(r.data.results)
                setloaded(true)
            })
            .catch(() => {

            })
       
    }, [])

    useEffect(() => {
        console.log("active is " + active)
        axios.get(url + '?page=' + active, { headers })
            .then((response) => {
                console.log(response.data)
                console.log(response.data.results)
                setCount(response.data.count)
                setPageCount(Math.ceil(response.data.count/page_size))
                setBids(response.data.results)
                setloaded(true)
            })
            .catch(err => console.log(err))
    } , [active])

    return (
        <Container>
            {
                loaded ?
                <>
                    <BidCards bids={bids}/>
                    <Row>
                        <Col style={{marginTop: "25px", justifyContent: "center", display: "flex"}}>
                            <MyPagination count={page_count} />
                        </Col>
                    </Row>
                </>
                : <></>
            }
        </Container>
    )
}



export default ItemBids