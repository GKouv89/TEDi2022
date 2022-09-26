import { useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import { Alert, Tooltip } from '@mui/material'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Carousel from 'react-bootstrap/Carousel'
import Link from '@mui/material/Link'
import { Breadcrumbs } from '@mui/material'

import { calcRemTime } from '../../components/Auctions/Browsing/ItemCard'
import AuthContext from '../../context/AuthContext'
import BidCreation from '../../components/Auctions/BidCreation'

function MyCarousel(props){
    const [index, setIndex] = useState(0)

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };    

    return(
        <>
            {props.images.length == 0 ?
                <Paper sx={{padding: '2vh', height: '65vh'}}><Typography variant="h3" component="body" sx={{paddingTop: '40%'}}>Ο πωλητής δεν προσέθεσε εικόνες για αυτή την δημοπρασία.</Typography></Paper>
            :
                <Carousel activeIndex={index} onSelect={handleSelect}>
                    {
                        props.images.map((image, idx) => 
                        <Carousel.Item key={idx}>
                            <img
                                src={`https://localhost:8000${image.image}`}
                                alt="Item image"
                            />
                        </Carousel.Item>)
                    }
                </Carousel>
            }
        </>
    )
}

const createAndDownloadJSON = (data) => {
    const dtdData = {
        'id': data.id,
        'name': data.name,
        'category': data.category.map((cat) => (cat.name)),
        'currently': data.currently,
        'first_bid': data.first_bid,
        'buy_price': data.buy_price,
        'number_of_bids': data.number_of_bids,
        'bids': (data.items_bids.map((bid) => ({'bidder': {'userID': bid.bidder.username, 'rating': bid.bidder.bidder_rating, 'location': bid.bidder.Address.address_name, 'country': bid.bidder.Address.Country}, 'time': bid.time, 'amount': bid.amount}))),
        'location': data.address.address_name,
        'country': data.address.Country,
        'started': data.started,
        'ends': data.ended,
        'seller': {
            'userID': data.seller.username,
            'rating': data.seller.seller_rating
        },
        'description': data.description
    }
    let DTDdataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dtdData))
    let downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", DTDdataStr)
    let fileName = `item${data.id}.json`
    downloadAnchorNode.setAttribute("download", fileName)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}

const createAndDownloadXML = (id) => {
    axios.get(`https://localhost:8000/auctions/${id}/xml/`)
        .then((response) => {
            console.log(response.data)
            let DTDdataStr = "data:text/xml;charset=utf-8," + encodeURIComponent(response.data)
            let downloadAnchorNode = document.createElement('a')
            downloadAnchorNode.setAttribute("href", DTDdataStr)
            let fileName = `item${id}.xml`
            downloadAnchorNode.setAttribute("download", fileName)
            document.body.appendChild(downloadAnchorNode)
            downloadAnchorNode.click()
            downloadAnchorNode.remove()
        })
        .catch((err) => console.log(err))
}

export default function ItemPage(){
    let { auctionid } = useParams()
    const [loaded, setLoaded] = useState(false)
    const [data, setData] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [visited, setVisited] = useState(false)

    const visitAuction = () => {
        let headers
        if(localStorage.getItem('token')){
            console.log('token exists')
            headers = { 
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }else{
            console.log('token does not exist')
            headers = { 
                'Content-Type': 'application/json'
            }
        }
        axios.post(`https://localhost:8000/auctions/${data.id}/visitors/`, {}, {headers})
            .then((response) => console.log(response))
            .then(() => setVisited(true))
            .catch((error) => console.log(error))
    }

    const fetchData = () => {
        const headers = {
            'Content-Type': 'application/json',
        }
        axios.get(`https://localhost:8000/auctions/${auctionid}/`, {headers})
            .then((response) => {console.log(response.data); setData(response.data); setLoaded(true);})
            .catch((err) => console.log(err))
    }

    useEffect(() => fetchData(), [loaded])
    useEffect(() => {
        if(data !== null & !visited){
            visitAuction()
        }
    }, [data, visited])

    const { user } = useContext(AuthContext)

    const confirmCreation = () => {
        setOpenDialog(false)
        setOpenModal(true)
    }

    const tooltipWarning = () => {
        if(!user){
            return "Συνδεθείτε για να πραγματοποιήσετε αυτή την ενέργεια"
        }else if(user == data.seller.username){
            return "Ως πωλητής, δεν μπορείτε να υποβάλλετε προσφορές."
        }else if(localStorage.getItem('isAdmin') == 'true'){
            return "Ως διαχειριστής, δεν μπορείτε να υποβάλλετε προσφορές."
        }
        return ""
    }

    return(
        <>
            {loaded ? 
                <>
                    <Grid sx={{paddingTop: '2vh'}} container spacing={1} justifyContent="space-around">
                        <Grid item xs={11}>
                            <Breadcrumbs>
                                <Link variant="button" href="/index">Αρχική</Link>
                                <Link variant="button" href="/auctions/">Δημοπρασίες</Link>
                                <Typography variant="button">{data.name}</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={5}>
                            <MyCarousel images={data.items_images} />
                        </Grid>
                        <Grid item xs={5} container>
                            <Grid item xs={12}><Typography variant="h2">Πληροφορίες Προϊόντος</Typography></Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" component="h3">
                                    Όνομα προϊόντος:
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">{data.name}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" component="h3">Τιμή Πρώτης Προσφοράς:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">{data.first_bid}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" component="h3">Τρέχουσα καλύτερη τιμή:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">{data.currently}</Typography>
                            </Grid>
                            {
                                data.buy_price !== null ? 
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="h6" component="h3">Τιμή εξαγοράς: </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body">{data.buy_price}</Typography>
                                        </Grid>
                                    </>
                                : null
                            }
                            {
                                data.address !== null ? 
                                    <>
                                        <Grid item xs={6}>
                                            <Typography variant="h6" component="h3">Επωνυμία επιχείρισης: </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body">{data.address.address_name === "" ? '-' : data.address.address_name}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h6" component="h3">Χώρα: </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body">{data.address.Country}</Typography>
                                        </Grid>
                                    </>
                                : null
                            }
                            <Grid item xs={12}>
                                <Typography variant="h6" component="h3">Περιγραφή:</Typography>                            
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body">{data.description}</Typography>                            
                            </Grid>
                            <Grid item xs={6} sx={{paddingTop: '2vh'}}>
                                <Typography variant="h6" component="h3">Ημερομηνία αφετηρίας:</Typography>                            
                            </Grid>
                            <Grid item xs={6} sx={{paddingTop: '2vh'}}>
                                <Typography variant="body">{data.started}</Typography>                            
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" component="h3">Ημερομηνία λήξης:</Typography>                            
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body">{data.ended}</Typography>                            
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" component="body1">{calcRemTime(data.ended)}</Typography> 
                            </Grid>
                            <Grid item xs={12} sx={{paddingTop: '2vh'}}>
                                <Typography variant="h6" component="h3">Κατηγορίες</Typography>
                            </Grid>
                            <Grid item container justifyContent="center">
                                {data.category.map((cat, idx) => <Grid key={idx} item><Chip label={cat.name}/></Grid>)}
                            </Grid>
                            <Grid item xs={12} sx={{paddingTop: '2vh'}}>
                                <Tooltip title={tooltipWarning()}>
                                    <span>
                                        <Button onClick={() => setOpenDialog(true)} variant="contained" size="large" disabled={!user || data.seller.username == user || localStorage.getItem('isAdmin') == true}>Κάντε μία προσφορά</Button>
                                    </span>
                                </Tooltip>
                            </Grid>
                            {
                                localStorage.getItem("isAdmin") == "true" ?
                                    <>
                                        <Grid item xs={12} sx={{paddingTop: '2vh'}}>
                                            <Typography variant="h6" component="body1">Εξαγωγή πληροφοριών δημοπρασίας ως:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button onClick={() => createAndDownloadXML(data.id)}>XML</Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button onClick={() => createAndDownloadJSON(data)}>JSON</Button>
                                        </Grid>
                                    </>
                                : null
                            }
                        </Grid>
                    </Grid>
                    <BidCreation name={data.name} currently={data.currently} open={openDialog} setOpenDialog={setOpenDialog} confirmation={confirmCreation}/>
                    <Modal show={openModal} onHide={() => {setOpenModal(false);  setLoaded(false)}}>
                        <Modal.Header closeButton/>
                        <Modal.Body>
                            <Alert severity="success">
                                Η δημιουργία της προσφοράς ολοκληρώθηκε με επιτυχία!
                            </Alert>
                        </Modal.Body>
                    </Modal>
                </>
            : <></>}
        </>
    )
}