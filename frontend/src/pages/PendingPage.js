import React from 'react'
import Alert from 'react-bootstrap/Alert'
import {Container, Row, Col, Button} from 'react-bootstrap'

function PendingPage(){
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Alert variant="info">Η αίτησή σας αναμένει έγκριση από τον διαχειριστή.</Alert>
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

export default PendingPage