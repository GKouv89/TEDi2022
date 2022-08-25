import React, { useState, useEffect } from 'react'
import { Form, Container, Row, Col, Placeholder, Button} from 'react-bootstrap'

import * as Yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'

const schema = Yup.object().shape(
    {
        username: Yup.string()
                    .required('Υποχρεωτικό πεδίο.'),
        password: Yup.string()
                    .min(8, 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.')
                    .max(32, 'Ο κωδικός πρέπει να έχει το πολύ 32 χαρακτήρες.')
                    .required('Υποχρεωτικό πεδίο'),
        passwordValidation: Yup.string()
                                .required('Υποχρεωτικό πεδίο.')
                                .oneOf([Yup.ref('password'), null], 'Οι κωδικοί πρέπει να ταιριάζουν.'),
        firstName: Yup.string()
                    .required('Υποχρεωτικό πεδίο.'),
        lastName: Yup.string()
                    .required('Υποχρεωτικό πεδίο.'),
        email: Yup.string()
                    .required('Υποχρεωτικό πεδίο.')
                    .email('Μη έγκυρη διεύθυνση ηλεκτρονικού ταχυδρομείου.'),
        telephone: Yup.string()
                    .required('Υποχρεωτικό πεδίο.')
                    .matches(/^[0-9]+$/, "Ο αριθμός τηλεφώνου πρέπει να περιέχει μόνο ψηφία.")
                    .min(10, 'Ο αριθμός τηλεφώνου πρέπει να έχει 10 ψηφία.')
                    .max(10, 'Ο αριθμός τηλεφώνου πρέπει να έχει 10 ψηφία.'),
        tin: Yup.string()
                .required('Υποχρεωτικό πεδίο.')
                .matches(/^[0-9]+$/, "Ο αριθμός φορολογικού μητρώου πρέπει να περιέχει μόνο ψηφία.")
                .min(10, 'Ο αριθμός φορολογικού μητρώου πρέπει να έχει 10 ψηφία.')
                .max(10, 'Ο αριθμός φορολογικού μητρώου πρέπει να έχει 10 ψηφία.'),
        streetName: Yup.string()
                        .required('Υποχρεωτικό πεδίο.'),
        streetNumber: Yup.string()
                        .required('Υποχρεωτικό πεδίο.')
                        .matches(/^[0-9]+$/, "Μη έγκυρος αριθμός."),
        postalCode: Yup.string()
                        .required('Υποχρεωτικό πεδίο.')
                        .matches(/^[A-Za-z0-9][A-Za-z0-9\- ]{0,10}[A-Za-z0-9]$/, "Ο ταχυδρομικός κώδικας συνήθως περιέχει γράμματα, ψηφία, και προαιρετικά ένα κενό ή μία παύλα."),
        city: Yup.string()
                    .required('Υποχρεωτικό πεδίο.'),
        country: Yup.string()
                   .required('Υποχρεωτικό πεδίο')
                   .notOneOf([""], 'Επιλέξτε μία έγκυρη χώρα.'),
    })

const initialValues = {
    username: '',
    password: '',
    passwordValidation: '',
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    tin: '',
    streetName: '',
    streetNumber: '',
    postalCode: '',
    city: '',
    country: ''
}

export default function SignupPage(){

    return(
        <>
            <Container>
                <Row className="mb-3 mt-3">
                    <h1>Εγγραφή</h1>
                </Row>
                <Row>
                    <Formik
                        validationSchema={schema}
                        onSubmit={(values, actions) => {
                            console.log(values)
                            console.log('CALLING ')

                            const data = {
                                "username": values.username,
                                "password": values.password,
                                "first_name": values.firstName,
                                "last_name": values.lastName,
                                "email": values.email,
                                "phone_number": values.telephone,
                                "tin": values.tin,
                                "Address": {
                                    "Street_number": values.streetNumber,
                                    "Street_name": values.streetName,
                                    "Postal_code": values.postalCode,
                                    "City": values.city,
                                    "Country": values.country
                                }
                            }
                            const headers = {
                                'Content-Type': 'application/json',
                            }

                            axios.post('http://localhost:8000/register/', data, {headers})
                                .then((r) => {
                                    console.log(r.data)
                                    //store username and token to local storage
                                    window.localStorage.setItem("token", r.data.token)
                                    window.localStorage.setItem("username", r.data.user_data.username)
                                })
                                .catch(error => {
                                    console.log(error.response.status)
                                    //check if the server replied with {username: "A user with that username already exists."} and act accordingly
                                    if (error.response.status === 400) {
                                        if (typeof error.response.data.username !== "undefined") {
                                            alert("Υπάρχει ήδη χρήστης με το ίδιο username. Παρακαλώ εισάγετε άλλο.")
                                        }
                                    }
                                })
                        }}
                        initialValues={initialValues}
                    >
                    { props => 
                        (<SignupForm {...props}/>)
                    }
                    </Formik>
                </Row>
            </Container>
        </>
    )
}

function SignupForm(props){
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
        <Container>
            <Form noValidate onSubmit={props.handleSubmit} className="mt-3 border rounded">
                <Form.Group as={Row} className="mb-3 mt-3" controlId="reqFields">
                    <Form.Label column xs={12}>
                        Τα πεδία με αστερίσκο είναι υποχρεωτικά.
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formUsername">
                    <Form.Label className="required" column xs={3}>  Όνομα Χρήστη: </Form.Label>
                    <Col>
                        <Form.Control 
                            name="username" 
                            type="text"
                            {...props.getFieldProps('username')}
                            isInvalid={props.touched.username && props.errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.username}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formPassword">
                    <Form.Label className="required" column xs={3}>Κωδικός Πρόσβασης:</Form.Label>
                    <Col>
                        <Form.Control 
                            name="password"
                            type="password"
                            {...props.getFieldProps('password')}
                            isInvalid={props.touched.password && props.errors.password}
                            aria-describedby="passwordHelpBlock"
                        />
                        <Form.Text id="passwordHelpBlock" muted>
                            O κωδικός σας θα πρέπει να έχει μήκος 8 έως 32 χαρακτήρων.
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            {props.errors.password}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formPasswordValidation">
                    <Form.Label className="required" column xs={3}>Επιβεβαίωση Κωδικού Πρόσβασης:</Form.Label>
                    <Col>
                        <Form.Control name="passwordValidation" 
                            type="password"
                            {...props.getFieldProps('passwordValidation')}
                            isInvalid={props.touched.passwordValidation && props.errors.passwordValidation}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.passwordValidation}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formFirstName">
                    <Form.Label className="required" column xs={3}>Όνομα</Form.Label>
                    <Col>
                        <Form.Control 
                            name="firstName" 
                            type="text"
                            {...props.getFieldProps('firstName')}
                            isInvalid={props.touched.firstName && props.errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.firstName}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formSurname">
                    <Form.Label className="required" column xs={3}>Επώνυμο</Form.Label>
                    <Col>
                        <Form.Control 
                            name="lastName"
                            type="text"
                            {...props.getFieldProps('lastName')}
                            isInvalid={props.touched.lastName && props.errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.lastName}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formBasicEmail">
                    <Form.Label className="required" column xs={3}>Διεύθυνση Email</Form.Label>
                    <Col>
                        <Form.Control 
                            name="email"
                            type="email"
                            {...props.getFieldProps('email')}
                            isInvalid={props.touched.email && props.errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.email}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formPhoneNumber">
                    <Form.Label className="required" column xs={3}>Τηλέφωνο Επικοινωνίας</Form.Label>
                    <Col>
                        <Form.Control 
                            name="telephone"
                            type="tel"
                            {...props.getFieldProps('telephone')}
                            isInvalid={props.touched.telephone && props.errors.telephone}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.telephone}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formTIN">
                    <Form.Label className="required" column xs={3}>Αριθμός Φορολογικού Μητρώου</Form.Label>
                    <Col>
                        <Form.Control 
                            name="tin"
                            type="text"
                            {...props.getFieldProps('tin')}
                            isInvalid={props.touched.tin && props.errors.tin}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.tin}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formStreetName">
                    <Form.Label className="required" column xs={3}>Οδός</Form.Label>
                    <Col>
                        <Form.Control
                            name="streetName"
                            type="text"
                            {...props.getFieldProps('streetName')}
                            isInvalid={props.touched.streetName && props.errors.streetName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.streetName}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formStreetNumber">
                    <Form.Label className="required" column xs={3}>Αριθμός</Form.Label>
                    <Col>
                        <Form.Control
                            name="streetNumber"
                            type="text"
                            {...props.getFieldProps('streetNumber')}
                            isInvalid={props.touched.streetNumber && props.errors.streetNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.streetNumber}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formStreetZIPCode">
                    <Form.Label className="required" column xs={3}>Ταχυδρομικός Κώδικας</Form.Label>
                    <Col>
                        <Form.Control 
                            name="postalCode"
                            type="text"
                            {...props.getFieldProps('postalCode')}
                            isInvalid={props.touched.postalCode && props.errors.postalCode}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.postalCode}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formCity">
                    <Form.Label className="required" column xs={3}>Πόλη</Form.Label>
                    <Col>
                        <Form.Control 
                            name="city"
                            type="text"
                            {...props.getFieldProps('city')}
                            isInvalid={props.touched.city && props.errors.city}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.city}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 ml-1" controlId="formCountry">
                    <Form.Label className="required" column xs={3}>Χώρα</Form.Label>
                    <Col>
                        {options ? 
                            <>
                                <Form.Select
                                    name="country"
                                    value={props.values.country}
                                    onChange={e => props.setFieldValue('country', e.target.value)}
                                    onBlur={props.handleBlur}
                                    isInvalid={props.errors.country}
                                >
                                    <option value="">Επιλέξτε</option>
                                    {options}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {props.errors.country}
                                </Form.Control.Feedback>
                            </>
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
    )
}