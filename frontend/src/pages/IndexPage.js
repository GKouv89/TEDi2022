import React, {useContext, useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import {Container, Row} from 'react-bootstrap'
import { Snackbar, Alert } from '@mui/material';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

export default function IndexPage(){
    let {user} = useContext(AuthContext)
    const [open, setOpen] = useState(false)
    const vertical = "bottom"
    const horizontal = "center"

    useEffect(()=>{
        const url = 'https://localhost:8000/auctions/promptMessaging/'
        const data = {}
        axios.patch(url, data,
            {
                headers: {
                    "Authorization": `Token ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            }
        ).then((r) => {
            console.log(r.data.notify)
            if(r.data.notify) {
                setOpen(true)
            }
        })
    }, [])

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
            {
                localStorage.getItem('isAdmin') == 'false' ? 
                <>
                    <Row className="mt-3">
                        <Button size="lg" variant="primary" href="/boughtitems">Αξιολόγηση Αγορών</Button>
                    </Row>
                    <Row className="mt-3">
                        <Button size="lg" variant="primary" href="/solditems">Αξιολόγηση Αγοραστών</Button>
                    </Row>
                </>
                : null
            }
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
            <Snackbar
                anchorOrigin={{vertical, horizontal}}
                open={open}
                message="Πραγματοποιήθηκε κατοχύρωση δημοπρασίας. Παρακαλώ μεταβείτε στα μηνύματα για να συνεννοηθείτε για τα διαδικαστικά."
                key={vertical + horizontal}
                autoHideDuration={8000}
                onClose={()=>{setOpen(false)}}
            />
        </Container>
    )
}