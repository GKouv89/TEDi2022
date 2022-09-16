import { useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
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
                                src={`http://localhost:8000${image.image}`}
                                alt="Item image"
                            />
                        </Carousel.Item>)
                    }
                </Carousel>
            }
        </>
    )
}

export default function ItemPage(){
    let { auctionid } = useParams()
    const [loaded, setLoaded] = useState(false)
    const [data, setData] = useState(null)

    const fetchData = () => {
        const headers = {
            'Content-Type': 'application/json',
        }
        axios.get(`http://localhost:8000/auctions/${auctionid}/`, {headers})
            .then((response) => {console.log(response.data); setData(response.data); setLoaded(true) })
            .catch((err) => console.log(err))
    }

    useEffect(() => fetchData(), [])

    const { user } = useContext(AuthContext)

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
                            <Grid item xs={6}>
                                <Typography variant="h6" component="h3">Περιγραφή:</Typography>                            
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body">{data.description}</Typography>                            
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" component="h3">Ημερομηνία αφετηρίας:</Typography>                            
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body">{data.started}</Typography>                            
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" component="h3">Ημερομηνία λήξης:</Typography>                            
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body">{data.ended}</Typography>                            
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>{calcRemTime(data.ended)}</Typography> 
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" component="h3">Κατηγορίες</Typography>
                            </Grid>
                            <Grid item container justifyContent="center">
                                {data.category.map((cat, idx) => <Grid key={idx} item xs={3}><Chip label={cat.name}/></Grid>)}
                            </Grid>
                            <Grid item xs={12}>
                                <Button href={user ? null : "/signup"}variant="contained" size="large">Κάντε μία προσφορά</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                </>
            : <></>}
        </>
    )
}