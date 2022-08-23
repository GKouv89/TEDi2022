import React from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

export default function SigninPage(){
    let {loginUser} = useContext(AuthContext)

    return(
        <>
            <Container>
                <Row className="justify-content-md-center">
            <Form style={{paddingTop: "50px"}} onSubmit={loginUser}>
            
            <Form.Group  className="mb-3" controlId="formPlaintextUsername">
                <Form.Label column sm="2">
                Όνομα Χρήστη
                </Form.Label>
                <Row sm="10">
                <Form.Control name="username" type="username" placeholder="Username" style={{width: "50%", margin: "auto"}} />
                </Row>
            </Form.Group>

            <Form.Group  className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="2">
                Κωδικός Χρήστη
                </Form.Label>
                <Row sm="10">
                <Form.Control name="password" type="password" placeholder="Password" style={{width: "50%", margin: "auto"}} />
                </Row>
            </Form.Group>

            <Row>
            <Button type="submit" variant="success" style={{  width: "30%", margin: "auto"}}>Σύνδεση</Button>{' '}
            </Row>

            </Form>
            </Row>
            </Container>
        </> 
    )
}