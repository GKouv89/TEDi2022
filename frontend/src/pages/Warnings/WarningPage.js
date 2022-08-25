import Alert from 'react-bootstrap/Alert'
import {Container, Row, Col, Button} from 'react-bootstrap'

function UnauthorizedPage(){
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Alert variant="danger">Δεν επιτρέπεται η πρόσβαση σε αυτή την σελίδα.</Alert>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button href="/">Επιστροφή στην αρχική</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default UnauthorizedPage