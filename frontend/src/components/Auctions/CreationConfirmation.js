import Modal from 'react-bootstrap/Modal'
import { Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { EditAuctionContext } from '../../context/EditAutctionContext'

function CreationConfirmation(props){
    let navigate = useNavigate()
    const handleClose = () => {
        navigate('../auctionmanagement', {replace: true})
    }
    const {editing, setEditing} = useContext(EditAuctionContext)
    return(
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton/>
            <Modal.Body>
                <Alert severity="success">
                    {
                        editing ?
                            <>Η επεξεργασία δημοπρασίας ολοκληρώθηκε με επιτυχία!</>
                        :
                        <>Η δημιουργία της δημοπρασίας ολοκληρώθηκε με επιτυχία!</>
                    }
                    
                </Alert>
            </Modal.Body>
        </Modal>
    )
}

export default CreationConfirmation