import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Tab from 'react-bootstrap/Tab'

const userDetails = [
    {
        "username": "gina", 
        "firstName": "Gina",
        "lastName": "Koutiva",
        "email": "gina@mail.com",
        "phone_number": '0123456789',
        "tin": '0123456789',
        "Address":{
            "Street_number": 10,
            "Street_name": 'Μικράς Ασίας',
            "Postal_code": "241 33",
            "City": 'Καλαμάτα',
            "Country": 'Greece'
        },
        "isPending": true
    },
    {
        "username": "takis", 
        "firstName": "Takis",
        "lastName": "Koutivas",
        "email": "takis@mail.com",
        "phone_number": '0123456789',
        "tin": '0123456789',
        "Address":{
            "Street_number": 10,
            "Street_name": 'Μικράς Ασίας',
            "Postal_code": "241 33",
            "City": 'Καλαμάτα',
            "Country": 'Greece'
        },
        "isPending": true
    },
    {
        "username": "voula", 
        "firstName": "Voula",
        "lastName": "Theodorakopoulos",
        "email": "voula@mail.com",
        "phone_number": '0123456789',
        "tin": '0123456789',
        "Address":{
            "Street_number": 10,
            "Street_name": 'Μικράς Ασίας',
            "Postal_code": "241 33",
            "City": 'Καλαμάτα',
            "Country": 'Greece'
        },
        "isPending": false
    }
]

function UsersCard(props){
    console.log(props.results)
    let tabContent = []
    for(let i = 0; i < 3; i++){
        tabContent.push(<Tab.Pane eventKey={'#link' + i}>
                            <UserInfo i={i}/>
                        </Tab.Pane>)
    }
    return(
        <Tab.Container>
            <Row>
                <Col xs={4}>
                    <ListGroup>
                        {props.results.map((result, idx) => <UserCard key={idx} idx={idx} username={result.username} isPending={result.isPending} />)}
                    </ListGroup>
                </Col>
                <Col xs={8}>
                    <Tab.Content>
                        {tabContent}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )
}

function UserCard(props){
    return(
        <ListGroup.Item action href={'#link' + props.idx}>
            <Container className="align-items-start">
                <Row>
                    <Col>
                        {props.username}
                    </Col>
                    <Col>
                        <Badge pill bg={props.isPending ? "danger" : "success"}>
                            {props.isPending ? 'Εκκρεμεί' : 'Εγκρίθηκε'}
                        </Badge>
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    )
}

function UserInfo(props){
    console.log('Logging i...')
    console.log(props.i)
    return(
        <>
            <p>Όνομα χρήστη: {userDetails[props.i].username}</p>
            <p>Όνομα: {userDetails[props.i].firstName}</p>
            <p>Επώνυμο: {userDetails[props.i].lastName}</p>
            <p>Διεύθυνση ηλεκτρονικού ταχυδρομείου: {userDetails[props.i].email}</p>
            <p>Τηλέφωνο Επικοινωνίας: {userDetails[props.i].phone_number}</p>
            <p>Αριθμός Φορολογικού Μητρώου: {userDetails[props.i].tin}</p>
            <p>Διεύθυνση: {userDetails[props.i].Address.Street_name + ' ' + userDetails[props.i].Address.Street_number + ', ' + userDetails[props.i].Address.Postal_code + ', ' + userDetails[props.i].Address.City + ', ' + userDetails[props.i].Address.Country}</p>
            {userDetails[props.i].isPending ? <Button variant="success">Έγκριση χρήστη</Button>: <Button variant="outline-success" disabled>Εγκρίθηκε</Button>}
        </>
    )
}

export default UsersCard