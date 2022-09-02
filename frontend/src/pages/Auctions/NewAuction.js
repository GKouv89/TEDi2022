// Fields
    // Item Name
    // Category
    // First bid
    // Buy Price (Optional)
    // Address
        // Street name
        // Street number
        // postal code
        // city
        // country
        // Address name
    // Start date(time)
    // End date(time)
    // Description

import * as Yup from 'yup'
import { Formik } from 'formik'
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
    
import MultiAutocomplete from '../../components/Auctions/MultiAutocomplete'
 
const schema = Yup.object().shape(
    {
        categories: Yup.array()
            .min(1, 'Πρέπει να επιλέξετε τουλάχιστον μία κατηγορία')
    }
)

const initialValues = {
    categories: []
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
    return(
        <Container>
            <Form noValidate onSubmit={props.handleSubmit} className="mt-3 border rounded">
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
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    )
}