import React, { useContext } from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import AuthContext from '../context/AuthContext';
import { AlertContext } from "../context/VisibleAlert"; 
import AuctionManagement from '../pages/Auctions/AuctionManagement';
import WelcomePage from '../pages/WelcomePage';
import { useNavigate } from "react-router-dom";
import { Divider, Badge,Button } from '@mui/material'

function Header(){
    let {user} = useContext(AuthContext)
    const navigate = useNavigate();
    return(
        <Navbar bg="dark" variant="dark">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand className="justify-content-start" onClick={(e)=> {
                        e.preventDefault();
                        if(user === null) {
                            navigate("/")
                        } else {
                            console.log("logged in user")
                            navigate("/index");
                        }
                    }}>
                        E-Auction
                    </Navbar.Brand>
                </LinkContainer>
                {user ? <LoggedInNav /> : <NotLoggedInNav /> }
            </Container>
        </Navbar>
    )
}

function NotLoggedInNav(){
    let {visible, setVisible, AlertMessage, setAlertMessage} = useContext(AlertContext);
   
    return(
        <Nav className="justify-content-end">
            <LinkContainer to="/login">
                <Nav.Link onClick={() => setVisible(false)}>Σύνδεση</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signup">
                <Nav.Link onClick={() => setVisible(false)}>
                    Εγγραφή
                </Nav.Link>
            </LinkContainer>
        </Nav>
    )
}

function LoggedInNav(){
    let {user, logoutUser, isAdmin, isPending} = useContext(AuthContext)
    const newMessages = true; // hardcoded ATM, we'll have to figure out where this belongs
    return(
        <>
            <Nav>
                <Navbar.Text>{user}</Navbar.Text>
                {isAdmin === 'true' ? 
                    <LinkContainer to="/admin">
                        <Nav.Link>Σελίδα διαχείρισης χρηστών</Nav.Link>
                    </LinkContainer>                
                :
                    isPending === 'false' ? 
                    <>
                        {/* <LinkContainer to="/auctionmanagement">
                            <Nav.Link>Οι δημοπρασίες μου</Nav.Link>
                        </LinkContainer> */}
                        <Button href="/auctionmanagement" variant="text">
                            Οι δημοπρασίες μου
                        </Button>
                        <Badge color="primary" overlap="rectangular" invisible={!newMessages} variant="dot">
                            {/* <LinkContainer to="/messages"> */}
                                {/* <Nav.Link>Τα μηνύματά μου</Nav.Link> */}
                            {/* </LinkContainer> */}
                            <Button href="/messages" variant="text">
                                Τα μηνύματά μου
                            </Button>
                        </Badge>
                    </>
                    : null
                }
                <Divider orientation="vertical" />
                <LinkContainer to="/">
                    <Nav.Link onClick={logoutUser}>Αποσύνδεση</Nav.Link>
                </LinkContainer>
            </Nav>
        </>
    )
}

export default Header