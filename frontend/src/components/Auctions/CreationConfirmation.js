import Modal from 'react-bootstrap/Modal'
import { Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function CreationConfirmation(props){
    let navigate = useNavigate()
    const handleClose = () => {
        navigate('../auctionmanagement', {replace: true})
    }
    return(
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton/>
            <Modal.Body>
                <Alert severity="success">
                    Η δημιουργία της δημοπρασίας ολοκληρώθηκε με επιτυχία!
                </Alert>
            </Modal.Body>
        </Modal>
    )
}

export default CreationConfirmation