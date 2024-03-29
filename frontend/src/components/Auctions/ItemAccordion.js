import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Rating from './Rating'

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
            {' '}  
            <ConditionalWrapper condition={props.item.number_of_bids}
                wrapper={children => (
                    <OverlayTrigger key={1} placement='top'
                        overlay={
                            <Tooltip id={'tooltip-bottom0'}>
                            Δεν είνα επιτρεπτή η διαγραφή, υπάρχουν ήδη προσφορές για τη συγκεκριμένη δημοπρασία. 
                            </Tooltip>
                        }
                    >
                        
                        {children}
                    </OverlayTrigger>
                )}
            >
                <span>
                <Button variant="danger" size="sm" onClick={() => props.callback(props.item.id)} disabled={props.item.number_of_bids ? true : false} >
                    Διαγραφή δημοπρασίας
                </Button>
                </span>
            </ConditionalWrapper>
            </div>
        </ListGroup.Item>
    )
}

function InterfaceForAcquiredAuctions(props){
    let firstRating
    if(props.case == 'sold')
        firstRating = props.item.buyer_rating
    else
        firstRating = props.item.rating
    let disabledRating = (firstRating !== 0)
    const [rating, setRating] = useState(props.case == 'sold' ? props.item.buyer_rating : props.item.rating)

    return(
        <>
            <ListGroup.Item>
                {props.case == 'bought' ?
                        `Πωλητής: ${props.item.seller.username}`
                    :
                        `Αγοράστηκε από: ${props.item.buyer.username}`
                }
            </ListGroup.Item>
            <ListGroup.Item>
                Αξιολογήστε
                {props.case == 'bought' ?
                        ` την δημοπρασία: `
                    :
                        ' τον αγοραστή: '
                }
                <Rating rating={rating} disabled={disabledRating} setRating={setRating}/>
            </ListGroup.Item>
            <ListGroup.Item>
                <Button disabled={firstRating !== 0} onClick={() => props.callback(props.item.id, rating)}>Υποβολή Αξιολόγησης</Button>
            </ListGroup.Item>
        </>
    )
}

export function ItemAccordion(props){
    console.log(props)
    console.log(typeof props.ratingCallback)
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
                                {
                                    props.case == 'management' ?  <ListGroup.Item>Αριθμός προσφορών: {item.number_of_bids}</ListGroup.Item> : null
                                }
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
                                    props.case == 'management' ? <InterfaceForManagableAuctions item={item} callback={props.deleteCallback}/> : <InterfaceForAcquiredAuctions item={item} case={props.type} callback={props.ratingCallback}/>
                                }
                            </ListGroup>
                        </AccordionBody>
                    </Accordion.Item>
                )}
            </Accordion>
        </>
    )
}