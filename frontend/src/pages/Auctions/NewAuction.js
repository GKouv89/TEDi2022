import {useState, useEffect} from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Container, Form, Row, Col, Button, Placeholder, FormControl } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import MultiAutocomplete from '../../components/Auctions/MultiAutocomplete'
import CreationConfirmation from '../../components/Auctions/CreationConfirmation'
import axios from 'axios';

import AuctionCreationForm, {schema}  from './AuctionForm';

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
    ended: '',
    image_url: []
}

export default function NewAuction(){
    const [show, setShow] = useState(false)

    const createMyModelEntry = async (values) => {
        let form_data = new FormData();
        if (typeof values.image_url != 'string'){
            for(let i = 0; i < values.image_url.length; i++){
                form_data.append(`items_images[${i}][image]`, values.image_url[i], values.image_url[i].name);
            }
        }
        form_data.append('name', values.name)
        form_data.append('first_bid', values.first_bid)
        form_data.append('buy_price', values.buy_price)
        form_data.append('description', values.description)
        form_data.append('address[address_name]', values.addressName)
        form_data.append('address[Street_number]', values.streetNumber)
        form_data.append('address[Street_name]', values.streetName)
        form_data.append('address[Postal_code]', values.postalCode)
        form_data.append('address[City]', values.city)
        form_data.append('address[Country]', values.country)
        for(let i = 0; i < values.categories.length; i++){
            form_data.append(`categories[${i}]`, values.categories[i])            
        }
        form_data.append('started', values.started)
        form_data.append('ended', values.ended)
        return form_data
    }
    
    return (
        <Container>
            <Row>
                <Formik
                    validationSchema={schema}
                    onSubmit={(values, actions) => {
                        console.log('From formik: ', values.image_url)
                        createMyModelEntry(values)
                            .then((res) => {
                                axios.post(
                                    'http://localhost:8000/auctions/',
                                    res,
                                    {
                                        headers: {
                                            "Authorization": `Token ${localStorage.getItem('token')}`,
                                            "Content-Type": "multipart/form-data"
                                        }
                                    }
                                )
                                .then((response) => console.log(response))
                                .then(() => setShow(true))
                                .catch((err) => console.log(err))
                            })
                    }}
                    initialValues={initialValues}
                >
                    {/* { props => 
                        (<AuctionCreationForm {...props}/>)
                    } */}
                    { props => 
                        (<AuctionCreationForm {...props}/>)
                    }
                </Formik>
            </Row>
            <CreationConfirmation show={show} />
        </Container>
    )
}