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
        <IconButton onClick={handleClick}>
            {
                props.value <= props.rating ? 
                    <StarIcon />
                : 
                    <StarBorderIcon />
            }
        </IconButton>
    )
}

export default function Rating(props){

    return(
        <>
            {
                [...Array(5).keys()].map((number) => <MyStar key={number} value={number + 1} setRating={props.setRating} rating={props.rating}/>)
            }
        </>
    )
}