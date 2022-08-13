import React from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
import LinkContainer from 'react-router-bootstrap/LinkContainer'

function Header(){
    const isLoggedIn = false; // Temporary
    return(
        <Navbar bg="dark" variant="dark">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand className="justify-content-start">
                        E-Auction
                    </Navbar.Brand>
                </LinkContainer>
                {!isLoggedIn ? <NotLoggedIn /> : null }
            </Container>
        </Navbar>
    )
}

function NotLoggedIn(){
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

export default Header