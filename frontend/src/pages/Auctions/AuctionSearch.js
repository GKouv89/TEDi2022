import {useState, useEffect, useContext} from 'react'
import axios from 'axios'

import ItemCard, { SkeletonCard } from "../../components/Auctions/Browsing/ItemCard"
import MyPagination from '../../components/MyPagination'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Sidebar from '../../components/Auctions/Browsing/Sidebar'
import { Breadcrumbs, Link, Typography } from '@mui/material'

import { SearchContext } from '../../context/SearchContext'

function AuctionSearch(){
    const {fetchData, data, count, loaded} = useContext(SearchContext)

    useEffect(() => {fetchData(1)}, [])

    return(
        <>
            <Breadcrumbs sx={{paddingTop: '1vh', paddingLeft: '1vw'}}>
                <Link variant="button" href="/index">Αρχική</Link>
                <Typography variant="button"></Typography>
            </Breadcrumbs>
            <Stack direction="row" alignItems="flex-start" spacing={1}>
                <Sidebar />
                <Stack spacing={2} sx={{flex: 1}}>
                    <Grid container justifyContent="center" spacing={2}>
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
                    <Grid container justifyContent="center">
                        <Grid item xs={4}></Grid>
                            <Grid item xs={2}>
                                <MyPagination count={count}/>
                            </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                    <Typography variant="h4" component="body1">Εναλλακτικά, δείτε προτεινόμενες για εσάς δημοπρασίες πατώντας <Link href="/recommendations">εδώ.</Link></Typography>
                </Stack>
            </Stack>
        </>
    )
}

export default AuctionSearch