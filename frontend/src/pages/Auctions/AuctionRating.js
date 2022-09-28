import { useEffect, useState } from "react"
import axios from 'axios'
import { ItemAccordion } from "../../components/Auctions/ItemAccordion"
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

export default function AuctionRating(){
    const [items, setItems] = useState(null)
    const [loaded, setLoaded] = useState(false)

    const fetchData = () => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
        axios.get(`https://localhost:8000/auctions/${localStorage.getItem('username')}/bought/`, { headers })
            .then((response) => setItems(response.data.results))
            .catch((err) => console.log(err))
    }

    const rate = (id, rating) => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
        const data = {
            'rating': rating
        }
        axios.patch(`https://localhost:8000/auctions/${localStorage.getItem('username')}/bought/${id}/`, data, { headers })
            .then((response) => {
                console.log(response)
                window.location.reload(false);
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => fetchData(), [])
    useEffect(() => {items !== null && setLoaded(true)}, [items])

    return(
        <>
            <Breadcrumbs sx={{paddingLeft: '1vw', paddingTop: '1vh'}}>
                <Link variant="button" href="/index">Αρχική</Link>
                <Typography variant="button">Αξιολόγηση Αγορασθέντων</Typography>
            </Breadcrumbs>
            <Typography sx={{paddingBottom: '2vh'}} variant="h1">Αξιολόγηση Αγορασθέντων Δημοπρασιών</Typography>
            {
                loaded ? <ItemAccordion items={items} case={'rating'} type={'bought'} ratingCallback={rate}/> : null
            }
        </>
    )
}