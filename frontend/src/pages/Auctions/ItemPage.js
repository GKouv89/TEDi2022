import { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Carousel from 'react-bootstrap/Carousel'

function MyCarousel(props){
    const [index, setIndex] = useState(0)

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };    

    return(
        <>
            {props.images.length == 0 ?
                <Paper sx={{padding: '2vh'}}><Typography variant="h3" component="body">Ο πωλητής δεν προσέθεσε εικόνες για αυτή την δημοπρασία.</Typography></Paper>
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

    return(
        <>
            {loaded ? 
                <Grid sx={{paddingTop: '5vh'}} container spacing={1} justifyContent="space-around">
                    <Grid item xs={5}>
                        <MyCarousel images={data.items_images} />
                    </Grid>
                    <Grid item xs={5}>

                    </Grid>
                </Grid>
            : <></>}
        </>
    )
}