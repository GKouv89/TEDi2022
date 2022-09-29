import { useLocation} from "react-router-dom";
import * as Yup from 'yup'
import { Formik, useFormik } from 'formik'
import axios from 'axios'
import AuctionCreationForm, {schema}  from './AuctionForm';
import CreationConfirmation from '../../components/Auctions/CreationConfirmation'
import { Container, Row } from 'react-bootstrap'
import { useContext, useEffect, useState } from "react";
import { EditAuctionContext } from "../../context/EditAutctionContext"


String.prototype.lastIndexOfEnd = function(string) {
    var io = this.lastIndexOf(string);
    return io == -1 ? -1 : io + string.length;
}

function EditAuction() {
    const [show, setShow] = useState(false)
    const location = useLocation();
    const bid = location.state.item;
    console.log(bid)

    const initialValues = {
        name: bid.name,
        first_bid: bid.first_bid,
        buy_price: bid.buy_price,
        description: bid.description,
        addressName: bid.address.address_name,
        streetNumber: bid.address.Street_number,
        streetName: bid.address.Street_name,
        postalCode: bid.address.Postal_code,
        city: bid.address.City,
        country: bid.address.Country,
        categories: bid.category.map((item) => {
            return item.name
        }),
        started: bid.started,
        ended: bid.ended,
        image_url: []
    }

    const {editing, setEditing} = useContext(EditAuctionContext)
    const {Images, setImages} = useContext(EditAuctionContext)
    const {loadedImages, setLoadedImages} = useContext(EditAuctionContext)
    const { itemID, setItemID } = useContext(EditAuctionContext)
    setItemID(bid.id)
    const [okToSend, setOkToSend] = useState(false)

    useEffect(()=> { 
        setImages(bid.items_images.map((item) => {
                let index = item.image.lastIndexOfEnd('images/')
                return {"image_name": item.image.slice(index), "id": item.id}
        }))
        setLoadedImages(true)
        setEditing(true)
    }, [])

    const createMyModelEntry = async (values) => {
        let form_data = new FormData();
        if (typeof values.image_url != 'string'){
            for(let i = 0; i < values.image_url.length; i++){
                form_data.append(`items_images[${i}][image]`, values.image_url[i], values.image_url[i].name);
                console.log(values.image_url[i])
                console.log(values.image_url[i].name)
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
    
    return(
        <Container>
            <Row>
                <Formik
                    validationSchema={schema}
                    onSubmit={(values, actions) => {
                        console.log("SUBMITTING")
                        if (okToSend) {
                            const data = {}
                            const url = 'https://localhost:8000/auctions/' + bid.id + '/'
                            console.log(values)
                            console.log(values.image_url)
                            createMyModelEntry(values)
                                .then((res) => {
                                for (var pair of res.entries()) {
                                    console.log(pair[0]+ ' - ' + pair[1]); 
                                }
                                    axios.patch(url, res,
                                        {
                                            headers: {
                                                "Authorization": `Token ${localStorage.getItem('token')}`,
                                                "Content-Type": "application/json"
                                            }
                                        }
                                    )
                                    .then((response) => console.log(response))
                                    .then(() => setShow(true))
                                    // .catch((err) => console.log(err))
                                })
                        }
                    }}
                    initialValues={initialValues}
                >
                    { props => 
                        (<AuctionCreationForm {...props} state={{okToSend, setOkToSend}}/>)
                    }
                </Formik>
            </Row>
            <CreationConfirmation show={show} />
        </Container>
    )
}

export default EditAuction