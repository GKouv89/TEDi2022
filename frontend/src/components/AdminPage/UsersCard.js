import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'

function UsersCard(props){
    console.log(props.results)
    return(
        <ListGroup>
            {props.results.map((result, idx) => <UserCard key={idx} username={result.username} isPending={result.isPending} />)}
        </ListGroup>
    )
}

function UserCard(props){
    return(
        // <ListGroup.Item className="d-flex justify-content-between align-items-start">{props.username}<Badge pill bg={props.isPending ? "danger" : "success"}>{props.isPending ? 'Εκκρεμεί' : 'Εγκρίθηκε'}</Badge></ListGroup.Item>
        <ListGroup.Item>
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

export default UsersCard