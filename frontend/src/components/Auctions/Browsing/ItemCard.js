import {useState, useEffect} from 'react'
import axios from 'axios'

import Card from '@mui/material/Card';
import { CardActionArea, CardActions } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import dayjs from 'dayjs'

function calcRemTime(ended){
    const now = dayjs()
    const endedDate = dayjs(ended, "DD-MM-YYYY HH:mm:ss")
    if(endedDate.diff(now, 'day') == 1){
        return `Απομένει ${endedDate.diff(now, 'day')} ημέρα`
    }else if(endedDate.diff(now, 'day') == 0){
        let diff = endedDate.diff(now, 'hour')
        if(diff == 1){
            return `Απομένει ${diff} ώρα`
        }else if(diff == 0){
            diff = endedDate.diff(now, 'minute')
            if(diff == 1){
                return `Απομένει ${diff} λεπτό`
            }else if(diff == 0){
                diff = endedDate.diff(now, 'second')
                if(diff == 1){
                    return `Απομένει ${diff} δευτερόλεπτο`
                }
                return `Απομένουν ${diff} δευτερόλεπτα`
            }
            return `Απομένουν ${diff} λεπτά`
        }
        return `Απομένουν ${diff} ώρες`
    }else{
        return `Απομένουν ${endedDate.diff(now, 'day')} ημέρες`
    }
}

function SkeletonizedBit(props){
    return(
        <>
            {
                props.loaded ?
                    <Typography variant={props.variant} gutterBottom>
                        {props.data}
                    </Typography>                                
                :
                    <Skeleton variant="text" />
            }
        </>
    )
}

function ItemCard(){
    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const fetchData = () => {
        const headers = {
            'Content-Type': 'application/json',
        }
        axios.get('http://localhost:8000/auctions/', { headers })
            .then((response) => {
                setData(response.data.results)
                setLoaded(true)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {fetchData()}, [])
    return(
        <Card sx={{ width: '33vw'}}>
            <CardActionArea>
                    {
                        loaded ? 
                            data[1].items_images.length == 0 ? 
                                <Typography variant="h3" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '33vh'}}>Εικόνα μη διαθέσιμη</Typography>
                            :
                                <CardMedia component="img" sx={{ height: '33vh'}} image={`${data[1].items_images[0].image}`}/>
                        :
                            <Skeleton variant="rectangular" sx={{ height: '33vh'}} />
                    }
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <SkeletonizedBit variant="h2" data={loaded ? data[1].name : null} loaded={loaded} />
                        </Grid>
                        <Grid item xs={6}>
                            <SkeletonizedBit variant="body1" data={loaded ? `Από ${data[1].first_bid}€ `: null} loaded={loaded} />
                        </Grid>
                        <Grid item xs={6}>
                            <SkeletonizedBit variant="body1" data={loaded ? calcRemTime(data[1].ended) : null} loaded={loaded} />
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ItemCard