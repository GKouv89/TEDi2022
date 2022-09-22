import { IoIosAddCircle } from "react-icons/io";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";
import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const ConditionalWrapper = ({
    condition,
    wrapper,
    children,
}) => (condition ? wrapper(children) : children);

function AuctionManagement(){
    const [Items, setItems] = useState([])
    const navigate = useNavigate();
    const handleGoToNewAuction = () => navigate("/NewAuction");
    const handleGoToItemBids = (id) => {
        navigate("/auctionmanagement/ItemBids", { state: {id} })
    }
    const handleGoToEditAuction = (item) => {
        navigate("/auctionmanagement/EditAuction", { state: {item} });
    }
    
    //get all the items that this user sells
    useEffect(() => {
        const headers = {
            "Authorization": `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        }
        const data = {}
        const url = `http://localhost:8000/auctions/${localStorage.getItem('username')}/`
        axios.get(url, {headers})
            .then((r) => {
                console.log(r.data.results)

                setItems(r.data.results.map((item, index) => {
                    console.log(item)
        
                    return (
                        <Accordion.Item eventKey={index} key={index}>
                            <Accordion.Header>{item.name}</Accordion.Header>
                            <AccordionBody>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>Περιγραφή προϊόντος: {item.description}</ListGroup.Item>
                                    <ListGroup.Item>Τρέχουσα καλύτερη προσφορά: {item.currently}$</ListGroup.Item>
                                    <ListGroup.Item>Τιμή πρώτης προσφοράς: {item.first_bid}$</ListGroup.Item>
                                    <ListGroup.Item>Τιμή εξαγοράς: {item.buy_price}$</ListGroup.Item>
                                    <ListGroup.Item>Αριθμός προσφορών: {item.number_of_bids}</ListGroup.Item>
                                    <ListGroup.Item>Κατηγoρία: 
                                    <ListGroup horizontal style={{justifyContent: "center", display: "flex"}}>
                                        {item.category.map((c, ind) => {
                                            return (
                                                <ListGroup.Item key={ind}>{c.name}</ListGroup.Item>
                                            )
                                        })}
                                    </ListGroup> 
                                    </ListGroup.Item> 

                                    <ListGroup.Item>Έναρξη δημοπρασίας: {item.started}</ListGroup.Item>
                                    <ListGroup.Item>Λήξη δημοπρασίας: {item.ended}</ListGroup.Item>
                                    <ListGroup.Item>Διεύθυνση: { item.address.Street_name } { item.address.Street_number } { item.address.Postal_code } { item.address.City } {item.address.Country}</ListGroup.Item>
                                    { item.address.address_name ? 
                                        <ListGroup.Item>Επωνυμία Επιχείρησης:  {item.address.address_name} </ListGroup.Item>
                                        :
                                        <></>
                                    }
                                    <ListGroup.Item>
                                        <div className="mb-2">
                                        <ConditionalWrapper condition={!item.number_of_bids}
                                            wrapper={children => (
                                                <OverlayTrigger key={1} placement='top'
                                                    overlay={
                                                        <Tooltip id={'tooltip-bottom0'}>
                                                        Δεν υπάρχουν προσφορές για τη συγκεκριμένη δημοπρασία.
                                                        </Tooltip>
                                                    }
                                                >
                                                    
                                                    {children}
                                                </OverlayTrigger>
                                            )}
                                        >
                                            <span>
                                            <Button variant="primary" size="sm" onClick={() => handleGoToItemBids(item.id)} disabled={item.number_of_bids ? false : true} >
                                                Προβολή προσφορών
                                            </Button>
                                            </span>
                                        </ConditionalWrapper>
                                        
                                        {' '}
                                        
                                        <ConditionalWrapper condition={item.number_of_bids}
                                            wrapper={children => (
                                                <OverlayTrigger key={1} placement='top'
                                                    overlay={
                                                        <Tooltip id={'tooltip-bottom0'}>
                                                        Υπάρχουν ήδη προσφορές για τη συγκεκριμένη δημοπρασία.
                                                        </Tooltip>
                                                    }
                                                >
                                                    
                                                    {children}
                                                </OverlayTrigger>
                                            )}
                                        >         
                                            <span>
                                            <Button variant="primary" size="sm" onClick={() => handleGoToEditAuction(item)} disabled={item.number_of_bids ? true : false} >
                                                Επεξεργασία δημοπρασίας
                                            </Button> 
                                            </span>
                                        </ConditionalWrapper>    
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </AccordionBody>
                        </Accordion.Item>
                    )
                }))
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
            <Accordion>
                {Items}
            </Accordion>
        </>
    )
}

export default AuctionManagement