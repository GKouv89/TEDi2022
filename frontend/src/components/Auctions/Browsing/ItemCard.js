import {useState, useEffect} from 'react'
import axios from 'axios'

import Card from '@mui/material/Card';
import { CardActionArea, CardActions } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

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

function ItemCard(props){
    return(
        <Card>
            <CardActionArea component={Link} to={`${props.data.id}`}>
                    {
                        props.loaded ? 
                            props.data.items_images.length == 0 ? 
                                <Typography variant="h3" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '33vh'}}>Εικόνα μη διαθέσιμη</Typography>
                            :
                                <CardMedia component="img" sx={{ height: '33vh'}} image={`${props.data.items_images[0].image}`}/>
                        :
                            <Skeleton variant="rectangular" sx={{ height: '33vh'}} />
                    }
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h2" gutterBottom>
                                {props.data.name}
                            </Typography>                                
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" gutterBottom>
                                {`Από ${props.data.currently}€ `}
                            </Typography>                                
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" gutterBottom>
                                {calcRemTime(props.data.ended)}
                            </Typography>                                
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export function SkeletonCard(){
    return(
        <Card>
            <CardActionArea>
                <Skeleton variant="rectangular" sx={{ height: '33vh'}} />
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Skeleton variant="text" />
                        </Grid>
                        <Grid item xs={6}>
                            <Skeleton variant="text" />
                        </Grid>
                        <Grid item xs={6}>
                            <Skeleton variant="text" />
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ItemCard