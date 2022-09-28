import { IoIosAddCircle } from "react-icons/io";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ItemAccordion } from "../../components/Auctions/ItemAccordion";

function AuctionManagement(){
    const [Items, setItems] = useState([])
    
    const navigate = useNavigate();
    const handleGoToNewAuction = () => navigate("/NewAuction");

    //get all the items that this user sells
    useEffect(() => {
        const headers = {
            "Authorization": `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        }
        const data = {}
        const url = `https://localhost:8000/auctions/${localStorage.getItem('username')}/`
        axios.get(url, {headers})
            .then((r) => {
                console.log(r.data.results)
                setItems(r.data.results)
            })
            .catch(error => {
                console.log(error.response)
            })
    }, [])
  

    return(
        <>
            <Container fluid style={{marginTop: "25px", justifyContent: "center", display: "flex", border: "5px dotted green", marginBottom: "50px"}}>
                <Row>
                    <Col md={1}>
                    <h1> <IoIosAddCircle style={{color: 'green', cursor: 'pointer'}} onClick={handleGoToNewAuction}/> </h1>
                    </Col>
                    <Col md={10}>
                        <h3>Δημιουργήστε νέα δημοπρασία!</h3>
                    </Col>
                </Row>

            </Container>
            <ItemAccordion items={Items} case={'management'}/>            
        </>
    )
}

export default AuctionManagement