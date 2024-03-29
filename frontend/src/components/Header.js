import React, { useContext, useEffect } from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import AuthContext from '../context/AuthContext';
import { AlertContext } from "../context/VisibleAlert"; 
import AuctionManagement from '../pages/Auctions/AuctionManagement';
import WelcomePage from '../pages/WelcomePage';
import { useNavigate } from "react-router-dom";
import { Divider, Badge,Button } from '@mui/material'
import { UnreadMessagesContext } from '../context/UnreadMessages';
import axios from 'axios';

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
    const { unread, setUnread} = useContext(UnreadMessagesContext);
    useEffect(()=>{
        //check if there is at least one unread message
        if(user){
            const headers = {
                "Authorization": `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
            axios.get('https://localhost:8000/messages/inbox/unreadmessages/', {headers})  
                .then((r)=> {
                    console.log(r.data.unread)
                    setUnread(r.data.unread)
                })
        }
    }, [user])
    

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
                        <Badge color="primary" overlap="rectangular" invisible={!unread} variant="dot">
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