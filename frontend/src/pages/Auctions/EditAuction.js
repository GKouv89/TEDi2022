import { useLocation} from "react-router-dom";
import * as Yup from 'yup'
import { Formik, useFormik } from 'formik'
import axios from 'axios'
import AuctionCreationForm, {schema}  from './AuctionForm';
import CreationConfirmation from '../../components/Auctions/CreationConfirmation'
import { Container, Row } from 'react-bootstrap'

String.prototype.indexOfEnd = function(string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
}

String.prototype.lastIndexOfEnd = function(string) {
    var io = this.lastIndexOf(string);
    return io == -1 ? -1 : io + string.length;
}

function EditAuction() {
    const location = useLocation();
    console.log(location.state)
    const bid = location.state.item;
    console.log(bid.items_images)
    bid.items_images.map((item) => {
        console.log(item.image)
        console.log(item.image.lastIndexOfEnd('images/'))
        let index = item.image.lastIndexOfEnd('images/')
        console.log(item.image.slice(index))
    })
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
        image_url: bid.items_images.map((item) => { //just the name of every picture
            let index = item.image.lastIndexOfEnd('images/')
            return item.image.slice(index)
        })
    }

    return(
        <Container>
            <Row>
                <Formik
                    validationSchema={schema}
                    onSubmit={(values, actions) => {
                        const data = {}
                        console.log(values)
                        const url = 'https://localhost:8000/auctions/' + bid.id + '/'
                        axios.patch(url, values,
                            {
                                headers: {
                                    "Authorization": `Token ${localStorage.getItem('token')}`,
                                    "Content-Type": "application/json"
                                }
                            }
                        )
                        .then((response) => console.log(response))
                        // .then(() => setShow(true))
                        .catch((err) => console.log(err))
                       
                    }}
                    initialValues={initialValues}
                >
                    { props => 
                        (<AuctionCreationForm {...props}/>)
                    }
                </Formik>
            </Row>
            {/* <CreationConfirmation show={show} /> */}
        </Container>
    )
}

export default EditAuction