import {useState, useEffect} from 'react'
import axios from 'axios'

import ItemCard, { SkeletonCard } from "../../components/Auctions/Browsing/ItemCard"
import MyPagination from '../../components/MyPagination'
import Grid from '@mui/material/Grid'

function AuctionSearch(){
    const pageSize = 12; // Fixed number, same as backend
    const [count, setCount] = useState(0)
    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)

    const fetchData = (pageNo) => {
        const headers = {
            'Content-Type': 'application/json',
        }
        axios.get(`http://localhost:8000/auctions/?page=${pageNo}`, { headers })
            .then((response) => {
                console.log(response.data.count)
                setData(response.data.results)
                setLoaded(true)
                setCount(Math.ceil(response.data.count/pageSize))
            })
            .catch(err => console.log(err))
    }

    const paginationCallback = (pageNo) =>{
        setLoaded(false)
        fetchData(pageNo)
    }

    useEffect(() => {fetchData(1)}, [])

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
                <Grid item xs={12}>
                    <MyPagination count={count} callback={paginationCallback}/>
                </Grid>
            </Grid>
        </>
    )
}

export default AuctionSearch