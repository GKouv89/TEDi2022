import { useEffect, useState } from "react"
import axios from 'axios'

import { ItemAccordion } from "../../components/Auctions/ItemAccordion"
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

export default function BuyerRating(){
    const [items, setItems] = useState(null)
    const [loaded, setLoaded] = useState(false)

    const fetchData = () => {
        const headers = {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
        axios.get(`https://localhost:8000/auctions/${localStorage.getItem('username')}/sold/`, { headers })
            .then((response) => setItems(response.data.results))
            .catch((err) => console.log(err))
    }

    useEffect(() => fetchData(), [])
    useEffect(() => {items !== null && setLoaded(true)}, [items])

    return(
        <>
            <Breadcrumbs sx={{paddingLeft: '1vw', paddingTop: '1vh'}}>
                <Link variant="button" href="/index">Αρχική</Link>
                <Typography variant="button">Αξιολόγηση Αγοραστών</Typography>
            </Breadcrumbs>
            <Typography sx={{paddingBottom: '2vh'}} variant="h1">Αξιολόγηση Αγοραστών Πωλημένων Δημοπρασιών</Typography>
            {
                loaded ? <ItemAccordion items={items} case={'rating'} type={'sold'}/> : null
            }
        </>
    )
}