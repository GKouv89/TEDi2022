import MyPagination from '../components/MyPagination'
import UsersCard from '../components/AdminPage/UsersCard'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

export default function AdminPage(){
    const page_size = 10; // fixed value to paginate
    const count = 5; // dummy data atm, will come from request
    const page_count = count/page_size + 1
    console.log(page_count)
    const results = [ // dummy data atm, will come from request
        {"username": "gina", "isPending": true},
        {"username": "takis", "isPending": true},
        {"username": "voula", "isPending": false},
        {"username": "marina", "isPending": false},
        {"username": "dimitris", "isPending": true},
    ]

    return(
        <Container>
            <Row>
                <h1>Σελίδα Διαχείρισης Χρηστών</h1>
            </Row>
            <Row>
                <Col>
                    <ListGroup>
                        <UsersCard results={results}/>
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-center">
                    <MyPagination count={page_count}/>
                </Col>
            </Row>
        </Container>
    )
}