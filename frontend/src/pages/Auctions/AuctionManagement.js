import { IoIosAddCircle } from "react-icons/io";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ItemAccordion } from "../../components/Auctions/ItemAccordion";
import { PaginationContext } from "../../context/PaginationContext";
import MyPagination from "../../components/MyPagination";

function AuctionManagement(){
    const [Items, setItems] = useState([])
    const { active, setActive } = useContext(PaginationContext);
    const navigate = useNavigate();
    const handleGoToNewAuction = () => navigate("/NewAuction");
    const [page_count, setPageCount] = useState(0)
    const base_url = 'https://localhost:8000/auctions/'
    const page_size=12

    const handleDelete = (id) => {
        const url = base_url + id + '/'

        axios.delete(url,
            {
                headers: {
                    "Authorization": `Token ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            }).then(() => {
                window.location.reload(false);
            })
    }

    const headers = {
        "Authorization": `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    }

    //get all the items that this user sells
    useEffect(() => {
        const data = {}
        const url = base_url + `${localStorage.getItem('username')}/`
        axios.get(url, {headers})
            .then((r) => {
                console.log(r)
                setItems(r.data.results)
                setPageCount(Math.ceil(r.data.count/page_size))
            })
            .catch(error => {
                console.log(error.response)
            })
        setActive(1)
    }, [])

    useEffect(() => {
        console.log("active is " + active)
        const url = base_url + `${localStorage.getItem('username')}/`
        axios.get(url + '?page=' + active, { headers })
            .then((response) => {
                console.log(response.data)
                console.log(response.data.results)
                setPageCount(Math.ceil(response.data.count/page_size))
                setItems(response.data.results)
            })
            .catch(err => console.log(err))
    } , [active])
  

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
            <ItemAccordion items={Items} case={'management'} callback={handleDelete}/>      
            <MyPagination count={page_count} />
        </>
    )
}

export default AuctionManagement