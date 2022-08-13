import React, { useContext } from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
import LinkContainer from 'react-router-bootstrap/LinkContainer'
import AuthContext from '../context/AuthContext';

function Header(){
    let {user} = useContext(AuthContext)
    return(
        <Navbar bg="dark" variant="dark">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand className="justify-content-start">
                        E-Auction
                    </Navbar.Brand>
                </LinkContainer>
                {user ? <LoggedInNav /> : <NotLoggedInNav /> }
            </Container>
        </Navbar>
    )
}

function NotLoggedInNav(){
    return(
        <Nav className="justify-content-end">
            <LinkContainer to="/login">
                <Nav.Link>Σύνδεση</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signup">
                <Nav.Link>Εγγραφή</Nav.Link>
            </LinkContainer>
        </Nav>
    )
}

function LoggedInNav(){
    let {user} = useContext(AuthContext)
    return(
        <>
            <Nav>
                <Navbar.Text>{user}</Navbar.Text>
                <LinkContainer to="/">
                    <Nav.Link>Αποσύνδεση</Nav.Link>
                </LinkContainer>
            </Nav>
        </>
    )
}

export default Header