import { Alert, Dialog, DialogTitle, DialogActions, Button, InputAdornment, DialogContent, DialogContentText, InputBase, Typography, Divider } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function InputDialog(props){
    const [value, setValue] = useState('')
    const [valid, setValid] = useState(true)
    const regex = new RegExp(/^[1-9][0-9]*\.?[0-9]*$/)
    const validate = (value) => {
        console.log('validate')
        if (value.match(regex) === null && value !== ''){
            setValid(false)
            return
        }
        setValid(true)
    }

    return(
        <Dialog open={props.open}>
            <DialogTitle>
                Δημιουργία Προσφοράς
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Υποβάλλετε μία προσφορά για την δημοπρασία. Η τρέχουσα υψηλότερη τιμή 
                    είναι {props.currently}€.
                </DialogContentText>
                <InputBase 
                    autoFocus
                    endAdornment={<InputAdornment position="end">€</InputAdornment>}
                    onChange={(event) => {setValue(event.target.value); validate(event.target.value);}}
                />
                <Divider orientation="vertical" flexItem/>
                <Typography variant="button" sx={{visibility : !valid ? 'visible' : 'hidden'}}>Εισάγετε έναν έγκυρο αριθμό.</Typography>
            </DialogContent>
            <Alert severity="warning" sx={{visibility : parseFloat(value) <= parseFloat(props.currently) ? 'visible' : 'hidden'}}>Για να διεκδικήσετε την δημοπρασία, θα πρέπει η τιμή της προσφοράς σας να είναι μεγαλύτερη από την τρέχουσα καλύτερη τιμή.</Alert>
            <DialogActions>
                <Button onClick={() => props.setOpenDialog(false)}>Ακύρωση</Button>
                <Button onClick={() => {props.setPage(2); props.setValue(value)}} variant="contained">Υποβολή Προσφοράς</Button>
            </DialogActions>
        </Dialog>
    )
}

function ConfirmationDialog(props){
    return(
        <Dialog open={props.open}>
            <DialogTitle>
                Επιβεβαίωση
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning">
                    Είστε σίγουροι ότι θα θέλατε να υποβάλλετε προσφορά για το {props.name} ύψους {props.value}€; Δεν μπορείτε να αναιρέσετε αυτή την ενέργεια.
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {props.cleanup(false)}}>Ακύρωση</Button>
                <Button onClick={() => props.setPage(1)}>Αλλαγή τιμής προσφοράς</Button>
                <Button onClick={() => {props.setConfirmed(true)}} variant="contained">Οριστική Υποβολή</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function BidCreation(props){
    const [page, setPage] = useState(1)
    const [value, setValue] = useState('')
    const [confirmed, setConfirmed] = useState(false)

    const { auctionid } = useParams()

    const cleanup = () => {
        setPage(1)
        props.setOpenDialog(false)
        setValue('')
        setConfirmed(false)
    }

    const submitBid = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
        const data = {
            'amount': parseFloat(value)
        }
        axios.post(`http://localhost:8000/auctions/${auctionid}/bids/`, data, { headers })
            .then((response) => console.log(response))
            .then(() => props.confirmation())
            .catch((err) => console.log(err))
    }

    useEffect(() => {confirmed && submitBid()}, [confirmed])

    return(
        <>
            {page == 1 ? <InputDialog {...props} setValue={setValue} setPage={setPage}/> : <ConfirmationDialog {...props} value={value} cleanup={cleanup} setPage={setPage} setConfirmed={setConfirmed}/>}
        </>    
    )
}