import React, { useState, useEffect } from 'react'
import { Form, Container, Row, Col, Placeholder, Button} from 'react-bootstrap'

export default function SignupPage(){
    const [options, setOptions] = useState(null)

    useEffect(() => {
        async function fetchCountries(){
            fetch('https://restcountries.com/v3.1/all')
                .then((response) => response.json())
                .then((data) => {
                    let names = [];
                    let elems = [];
                    data.forEach(country => names.push(country.name.common));
                    names = names.sort();
                    names.map((name) => { 
                        elems.push(<option value={name}>{name}</option>)
                    });
                    console.log('Done');
                    setOptions(elems)
                })
        }
        fetchCountries()
    }, []);
    return(
        <>
            <Container>
                <Form className="mt-3 border rounded">
                    <Form.Group as={Row} className="mb-3" controlId="formUsername">
                        <Form.Label column xs={3}>  Όνομα Χρήστη: </Form.Label>
                        <Col>
                            <Form.Control type="text"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPassword">
                        <Form.Label column xs={3}>Κωδικός Πρόσβασης:</Form.Label>
                        <Col>
                            <Form.Control type="password" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formPasswordValidation">
                        <Form.Label column xs={3}>Επιβεβαίωση Κωδικού Πρόσβασης:</Form.Label>
                        <Col>
                            <Form.Control type="password" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formFirstName">
                        <Form.Label column xs={3}>Όνομα</Form.Label>
                        <Col>
                            <Form.Control type="text"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formSurname">
                        <Form.Label column xs={3}>Επώνυμο</Form.Label>
                        <Col>
                            <Form.Control type="text"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formBasicEmail">
                        <Form.Label column xs={3}>Διεύθυνση Email</Form.Label>
                        <Col>
                            <Form.Control type="email"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formPhoneNumber">
                        <Form.Label column xs={3}>Τηλέφωνο Επικοινωνίας</Form.Label>
                        <Col>
                            <Form.Control type="tel"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formTIN">
                        <Form.Label column xs={3}>Αριθμός Φορολογικού Μητρώου</Form.Label>
                        <Col>
                            <Form.Control type="text"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formStreetName">
                        <Form.Label column xs={3}>Οδός</Form.Label>
                        <Col>
                            <Form.Control type="text"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formStreetNumber">
                        <Form.Label column xs={3}>Αριθμός</Form.Label>
                        <Col>
                            <Form.Control type="text"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formStreetZIPCode">
                        <Form.Label column xs={3}>Ταχυδρομικός Κώδικας</Form.Label>
                        <Col>
                            <Form.Control type="text"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 ml-1" controlId="formCountry">
                        <Form.Label column xs={3}>Χώρα</Form.Label>
                        <Col>
                            {options ? 
                                <Form.Select>
                                    <option>Επιλέξτε</option>
                                    {options}
                                </Form.Select>
                            :   <Placeholder as={Form.Select}>
                                    <Placeholder xs={9} />
                                </Placeholder>
                            }
                        </Col>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Ολοκλήρωση Εγγραφής
                    </Button>
                </Form>
            </Container>
        </>
    )
}