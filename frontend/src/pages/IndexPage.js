import React, {useContext} from 'react'
import Button from 'react-bootstrap/Button';
import {Container, Row} from 'react-bootstrap'

import AuthContext from '../context/AuthContext';

export default function IndexPage(){
    let {user} = useContext(AuthContext)

    return(
        <Container className="mt-3">
            <Row>
                <h1>Καλως ήρθατε, {user ? user : 'κανείς'}!</h1>
            </Row>
            <Row className='mt-3'>
                <Button size="lg" variant="primary" href="/auctions">
                    Αναζήτηση Δημοπρασιών
                </Button>
            </Row>
            <Row className="mt-3">
                {localStorage.getItem('isAdmin') == 'true' ? 
                    <Button size="lg" variant="primary" href="/admin">
                        Διαχείριση Χρηστών
                    </Button>
                :
                    <Button size="lg" variant="primary" href="/auctionmanagement">
                        Διαχείριση Δημοπρασιών
                    </Button>
                }
            </Row>
            <Row className="mt-3">
                {localStorage.getItem('isAdmin') == 'true' ? 
                    <Button size="lg" variant="primary" href="/massexport">
                        Εξαγωγή Δεδομένων Δημοπρασίων
                    </Button>
                :
                    <Button size="lg" variant="primary" href="/recommendations">
                        Προτεινόμενες Δημοπρασίες
                    </Button>
                }
            </Row>
        </Container>
    )
}