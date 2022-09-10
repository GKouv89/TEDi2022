import {useState, useEffect} from 'react'
import axios from 'axios'

import ItemCard, { SkeletonCard } from "../../components/Auctions/Browsing/ItemCard"
import Grid from '@mui/material/Grid'

function AuctionSearch(){
    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)

    const fetchData = () => {
        const headers = {
            'Content-Type': 'application/json',
        }
        axios.get('http://localhost:8000/auctions/', { headers })
            .then((response) => {
                console.log(response.data.results)
                setData(response.data.results)
                setLoaded(true)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {fetchData()}, [])

    return(
        <>
            <Grid container spacing={2}>
                {
                    loaded ?
                        data.map((item, idx) => <Grid item xs={4}><ItemCard data={item} key={idx} loaded={loaded}/></Grid>)
                    :
                    <>
                        <Grid item xs={4}>
                            <SkeletonCard />
                        </Grid>
                        <Grid item xs={4}>
                            <SkeletonCard />
                        </Grid>
                        <Grid item xs={4}>
                            <SkeletonCard />
                        </Grid>
                    </>
                }
            </Grid>
        </>
    )
}

export default AuctionSearch