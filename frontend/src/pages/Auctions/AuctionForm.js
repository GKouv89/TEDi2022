import {useState, useEffect} from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Container, Form, Row, Col, Button, Placeholder, FormControl } from 'react-bootstrap';
import TextField, { textFieldClasses } from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import MultiAutocomplete from '../../components/Auctions/MultiAutocomplete'
import CreationConfirmation from '../../components/Auctions/CreationConfirmation'
import axios from 'axios';
import moment from 'moment';

export const schema = Yup.object().shape(
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

//returns true if "started" date is after the current moment
const started_validation = (started) => {
    const now = moment()
    const d1 = moment(started.$d)
    return d1.isAfter(now)
}

//returns true if the pair of dates is valid or false otherwise
const started_ended_validation = (started, ended) => {
    const d1 = moment(started.$d)
    const d2 = moment(ended.$d)
    return d1.isBefore(d2)
}

function AuctionCreationForm(props){
    const [invalidStartedDate, setInvalidStartedDate] = useState(false)
    const [invalidDates, setInvalidDates] = useState(false)
    const [options, setOptions] = useState(null)
    const [started, setStarted] = useState(props.values.started ? dayjs(props.values.started, "DD-MM-YYYY HH:mm:ss") : null)
    const [ended, setEnded] = useState(props.values.ended ? dayjs(props.values.ended, "DD-MM-YYYY HH:mm:ss") : null)
    const [image_url, setImage_url] = useState(null)
    // console.log(props.values.started)
    // console.log(props)
    // console.log(started)
    // let a = moment(started.$d)
    // // let a = moment('2022.09.16', 'YYYY.MM.DD')
    // console.log(a)
    // console.log(a.isValid())
    // console.log(started)

    // console.log("current moment")
    // let b = moment()
    // console.log(b)

    // console.log("comparing...")
    // console.log(a.isAfter(b))
    
    
    const [ startedError, setStartedError ] = useState("")
    const [ endedError, setEndedError ] = useState("")
    
    const handleStarted = (newValue) => {
        setStarted(newValue)
        props.setFieldValue('started', dayjs(newValue).format("DD-MM-YYYY HH:mm:ss"))
    }

    const handleEnded = (newValue) => {
        setEnded(newValue)
        props.setFieldValue('ended', dayjs(newValue).format("DD-MM-YYYY HH:mm:ss"))
    }

    const handleImage = (e) => {
        setImage_url(e.target.files);
        props.setFieldValue('image_url', e.target.files);
    }

    //check dates
    useEffect(() => {
        if (started) {
           setInvalidStartedDate(started_validation(started))
        }

        if (started && ended) {
            setInvalidDates(started_ended_validation(started, ended))
        }
    } , [started, ended])

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

    useEffect(() => {
        
    }, [ startedError, endedError ]);

    console.log(props.getFieldProps('categories'))

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
                                <p style={invalidStartedDate ? {display: 'none'} : {color: 'red'}}>
                                  {'Η έναρξη δημοπρασίας πρέπει να είναι ίδια ή μεταγενέστερη της τωρινής στιγμής.'}  
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
                            <p style={!props.errors.ended || invalidDates ? {display: 'none'} : {color: 'red'}}>
                                {props.errors.ended}
                            </p>
                            <p style={invalidDates? {display: 'none'} : {color: 'red'}}>
                                  {'Η ημερομηνία λήξης δημοπρασίας πρέπει να είναι μεταγενέστερη της ημερομηνίας έναρξης δημοπρασίας.'}  
                            </p>
                        </LocalizationProvider>
                    </Form.Group>
                </Row>
                <Form.Group as={Row} className="mb-3" controlId="formImage">
                    <Form.Label column xs={3}>Επιλογή Εικόνας: </Form.Label>
                    <Col>
                        <FormControl type="file" multiple onChange={handleImage}/>
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Υποβολή
                </Button>
            </Form>
        </Container>
    )
}

export default AuctionCreationForm