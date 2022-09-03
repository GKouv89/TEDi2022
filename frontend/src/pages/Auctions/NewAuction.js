// Fields
    // Start date(time)
    // End date(time)

import {useState, useEffect} from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Container, Form, Row, Col, Button, Placeholder } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import MultiAutocomplete from '../../components/Auctions/MultiAutocomplete'

const schema = Yup.object().shape(
    {
        name: Yup.string()
            .required('Υποχρεωτικό Πεδίο'),
        first_bid: Yup.string()
            .required('Υποχρεωτικό Πεδίο')
            .matches(/[1-9][0-9]*\.?[0-9]*/, 'Μη έγκυρη μορφή δεκαδικού αριθμού. Ελέγξτε ότι χρησιμοποιείται τελεία και όχι κόμμα για την υποδιαστολή.'),
        buy_price: Yup.string()
            .matches(/[1-9][0-9]*\.?[0-9]*/, 'Μη έγκυρη μορφή δεκαδικού αριθμού. Ελέγξτε ότι χρησιμοποιείται τελεία και όχι κόμμα για την υποδιαστολή.'),
        categories: Yup.array()
            .min(1, 'Πρέπει να επιλέξετε τουλάχιστον μία κατηγορία'),
        description: Yup.string()
            .required('Υποχρεωτικό Πεδίο'),
        addressName: Yup.string(),
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
        started: Yup.string()
            .required('Υποχρεωτικό πεδίο.'),
        ended: Yup.string()
            .required('Υποχρεωτικό πεδίο.')
    }
)

const initialValues = {
    name: '',
    first_bid: '',
    buy_price: '',
    description: '',
    addressName: '',
    streetNumber: '',
    streetName: '',
    postalCode: '',
    city: '',
    country: '',
    categories: [],
    started: '',
    ended: ''
}

export default function NewAuction(){
    return (
        <Container>
            <Row>
                <Formik
                    validationSchema={schema}
                    onSubmit={(values, actions) => {
                        console.log('From formik: ', values)
                    }}
                    initialValues={initialValues}
                >
                    { props => 
                        (<AuctionCreationForm {...props}/>)
                    }
                </Formik>
            </Row>
        </Container>
    )
}

function AuctionCreationForm(props){
    const [options, setOptions] = useState(null)
    const [started, setStarted] = useState(null)
    const [ended, setEnded] = useState(null)

    const handleStarted = (newValue) => {
        setStarted(newValue)
        props.setFieldValue('started', dayjs(newValue).format("DD-MM-YYYY HH:mm:ss"))
    }

    const handleEnded = (newValue) => {
        setEnded(newValue)
        props.setFieldValue('ended', dayjs(newValue).format("DD-MM-YYYY HH:mm:ss"))
    }

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
                <Form.Group as={Row} className="mb-3" controlId="formName">
                    <Form.Label className="required" column xs={3}> Όνομα Αντικειμένου: </Form.Label>
                    <Col>
                        <Form.Control 
                            name="name" 
                            type="text"
                            {...props.getFieldProps('name')}
                            isInvalid={props.touched.name && props.errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.name}
                        </Form.Control.Feedback>
                    </Col>  
                </Form.Group>
                <Form.Group as={Row}className="mb-3" controlId="formFirstBid">
                    <Form.Label className="required" column xs={3}> Τιμή Πρώτης Προσφοράς: </Form.Label>
                    <Col>
                        <Form.Control 
                            name="first_bid" 
                            type="text"
                            {...props.getFieldProps('first_bid')}
                            isInvalid={props.touched.first_bid && props.errors.first_bid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.first_bid}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formBuyPrice">
                    <Form.Label column xs={3}> Τιμή Εξαγοράς: </Form.Label>
                    <Col>
                        <Form.Control 
                            name="buy_price" 
                            type="text"
                            {...props.getFieldProps('buy_price')}
                            isInvalid={props.touched.buy_price && props.errors.buy_price}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.buy_price}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formDescription">
                    <Form.Label className="required" column xs={3}> Περιγραφή: </Form.Label>
                    <Col>
                        <Form.Control 
                            name="description" 
                            as="textarea" rows={3}
                            {...props.getFieldProps('description')}
                            isInvalid={props.touched.description && props.errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.description}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formAddressName">
                    <Form.Label column xs={3}> Επωνυμία Επιχείρησης: </Form.Label>
                    <Col>
                        <Form.Control 
                            name="addressName" 
                            type="text"
                            {...props.getFieldProps('addressName')}
                            isInvalid={props.touched.addressName && props.errors.addressName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.addressName}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Row>
                    <Form.Group as={Col} className="mb-3" controlId="formStreetName">
                        <Form.Label className="required"> Οδός: </Form.Label>
                        <Form.Control 
                            name="streetName" 
                            type="text"
                            {...props.getFieldProps('streetName')}
                            isInvalid={props.touched.streetName && props.errors.streetName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.streetName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} xs={1} className="mb-3" controlId="formStreetNumber">
                        <Form.Label className="required"> Αριθμός: </Form.Label>
                        <Form.Control 
                            name="streetNumber" 
                            type="text"
                            {...props.getFieldProps('streetNumber')}
                            isInvalid={props.touched.streetNumber && props.errors.streetNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.streetNumber}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" controlId="formPostalCode">
                        <Form.Label className="required"> Ταχυδρομικός Κώδικας: </Form.Label>
                        <Form.Control 
                            name="postalCode" 
                            type="text"
                            {...props.getFieldProps('postalCode')}
                            isInvalid={props.touched.postalCode && props.errors.postalCode}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.postalCode}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" controlId="formCity">
                        <Form.Label className="required"> Πόλη: </Form.Label>
                        <Form.Control 
                            name="city" 
                            type="text"
                            {...props.getFieldProps('city')}
                            isInvalid={props.touched.city && props.errors.city}
                        />
                        <Form.Control.Feedback type="invalid">
                            {props.errors.city}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3 ml-1" controlId="formCountry">
                        <Form.Label className="required">Χώρα: </Form.Label>
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
                    </Form.Group>
                </Row>
                <Form.Group as={Row} className="mb-3" controlId="formCategories">
                    <Form.Label className="required" column xs={3}>  Κατηγορίες: </Form.Label>
                    <Col>
                        <MultiAutocomplete 
                            {...props.getFieldProps('categories')}
                            setFieldValue={props.setFieldValue}
                        />
                        <p style={!props.errors.categories ? {display: 'none'} : {color: 'red'}}>
                            {props.errors.categories}
                        </p>
                    </Col>
                </Form.Group>
                <Row>
                    <Form.Group as={Col} className="mb-3" controlId="formStarted">
                        <Form.Label className="required"> Έναρξη Δημοπρασίας: </Form.Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>        
                                <DateTimePicker 
                                    label="Επιλέξτε..."
                                    value={started}
                                    onChange={handleStarted}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <p style={!props.errors.started ? {display: 'none'} : {color: 'red'}}>
                                    {props.errors.started}
                                </p>
                        </LocalizationProvider>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" controlId="formEnded">
                        <Form.Label className="required"> Λήξη Δημοπρασίας: </Form.Label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>        
                            <DateTimePicker 
                                label="Επιλέξτε..."
                                value={ended}
                                onChange={handleEnded}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <p style={!props.errors.ended ? {display: 'none'} : {color: 'red'}}>
                                {props.errors.ended}
                            </p>
                        </LocalizationProvider>
                    </Form.Group>
                </Row>
                <Button variant="primary" type="submit">
                    Δημιουργία Δημοπρασίας
                </Button>
            </Form>
        </Container>
    )
}