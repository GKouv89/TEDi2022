import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useNavigate } from "react-router-dom";

const ConditionalWrapper = ({
    condition,
    wrapper,
    children,
}) => (condition ? wrapper(children) : children);


function InterfaceForManagableAuctions(props){
    const navigate = useNavigate();
    const handleGoToItemBids = (id) => {
        navigate("/auctionmanagement/ItemBids", { state: {id} })
    }
    const handleGoToEditAuction = (item) => {
        navigate("/auctionmanagement/EditAuction", { state: {item} });
    }

    return(
        <ListGroup.Item>
            <div className="mb-2">
            <ConditionalWrapper condition={!props.item.number_of_bids}
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
                <Button variant="primary" size="sm" onClick={() => handleGoToItemBids(props.item.id)} disabled={props.item.number_of_bids ? false : true} >
                    Προβολή προσφορών
                </Button>
                </span>
            </ConditionalWrapper>
            
            {' '}
            
            <ConditionalWrapper condition={props.item.number_of_bids}
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
                <Button variant="primary" size="sm" onClick={() => handleGoToEditAuction(props.item)} disabled={props.item.number_of_bids ? true : false} >
                    Επεξεργασία δημοπρασίας
                </Button> 
                </span>
            </ConditionalWrapper>    
            </div>
        </ListGroup.Item>
    )
}

// function InterfaceForBoughtAuctions(props){

// }

// function InterfaceForSoldAuctions(props){
    
// }

export function ItemAccordion(props){
    return(
        <>
            <Accordion>
                {props.items.map((item, index) => 
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
                                {
                                    props.case == 'management' ? <InterfaceForManagableAuctions item={item} /> : null
                                }
                            </ListGroup>
                        </AccordionBody>
                    </Accordion.Item>
                )}
            </Accordion>
        </>
    )
}