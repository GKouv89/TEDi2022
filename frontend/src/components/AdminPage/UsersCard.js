import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Tab from 'react-bootstrap/Tab'

function UsersCard(props){
    console.log(props.results)
    let tabContent = []
    
    for(let i = 0; i < props.results.length; i++){
        tabContent.push(<Tab.Pane eventKey={'#link' + i}>
                            <UserInfo result={props.results[i]}/>
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
    return(
        <>
            <p>Όνομα χρήστη: {props.result.username}</p>
            <p>Όνομα: {props.result.first_name}</p>
            <p>Επώνυμο: {props.result.last_name}</p>
            <p>Διεύθυνση ηλεκτρονικού ταχυδρομείου: {props.result.email}</p>
            <p>Τηλέφωνο Επικοινωνίας: {props.result.phone_number}</p>
            <p>Αριθμός Φορολογικού Μητρώου: {props.result.tin}</p>
            <p>Διεύθυνση: {props.result.Address.Street_name + ' ' + props.result.Address.Street_number + ', ' + props.result.Address.Postal_code + ', ' + props.result.Address.City + ', ' + props.result.Address.Country}</p>
            {props.result.isPending ? <Button variant="success">Έγκριση χρήστη</Button>: <Button variant="outline-success" disabled>Εγκρίθηκε</Button>}
        </>
    )
}

export default UsersCard