import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'

import { useState } from 'react'

function MyStar(props){
    const handleClick = () => {
        props.setRating(props.value)
    }

    return(
        <Grid item xs={3}>
            <IconButton onClick={handleClick}>
                {
                    props.value <= props.rating ? 
                        <StarIcon />
                    : 
                        <StarBorderIcon />
                }
            </IconButton>
        </Grid>
    )
}

export function Rating(){
    const [rating, setRating] = useState(0)

    return(
        <>
            <Grid container spacing={1} columns={15} justifyContent="flex-start">
                {
                    [...Array(5).keys()].map((number) => <MyStar key={number} value={number + 1} setRating={setRating} rating={rating}/>)
                }
            </Grid>
        </>
    )
}