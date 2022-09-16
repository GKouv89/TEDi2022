import React, { useNavigate } from 'react'
import Button from 'react-bootstrap/Button';

export default function WelcomePage(){
    console.log('Welcome')
    return(
        <>
            <h1 style={{paddingTop: "100px"}}>Καλώς ήρθατε!</h1>
        
            <div className="d-grid gap-2" style={{paddingTop: "100px"}}>
                <Button variant="primary" size="lg" style={{width: "80%", margin: "auto"}}>
                    Πλοηγήσου ως επισκέπτης
                </Button>
                <Button href="/signup" variant="secondary" size="lg" style={{width: "80%", margin: "auto"}}>
                    Κάνε εγγραφή
                </Button>
            </div>
        </>
    )
}