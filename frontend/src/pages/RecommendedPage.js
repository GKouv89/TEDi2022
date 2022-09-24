import { useState, useEffect } from 'react'

import ItemCard from "../components/Auctions/Browsing/ItemCard";
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import axios from "axios";

export function RecommendedPage(){
    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)

    const fetchData = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
        axios.get(`https://localhost:8000/auctions/recommended/`, {headers})
            .then((response) => setData(response.data.results))
            .then(() => setLoaded(true))
            .catch((err) => console.log(err))
    }

    useEffect(() => fetchData(), [])

    return(
        <Stack spacing={2} sx={{flex: 1}}>
            <Breadcrumbs sx={{paddingTop: '1vh', paddingLeft: '1vw'}}>
                <Link variant="button" href="/index">Αρχική</Link>
                <Typography variant="button">Προτεινόμενα</Typography>
            </Breadcrumbs>
            <Typography variant="h1">Προτεινόμενα για εσάς</Typography>
            <Grid container spacing={2} justifyContent="center">
                {loaded ? 
                    data.map((item, index) => 
                        <Grid key={index} xs={6} item>
                            <ItemCard data={item} key={index} loaded={loaded}/>
                        </Grid>)
                : 
                null}
            </Grid>
        </Stack>
    )
}