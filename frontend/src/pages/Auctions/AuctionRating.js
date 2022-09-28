import { useEffect } from "react"
import { ItemAccordion } from "../../components/Auctions/ItemAccordion"
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const items = [
    {
        'id': 17,
        'name': 'Floor lamp',
        'description': 'Floor lamp',
        'started': '08-08-2022',
        'ended': '08-09-2022',
        'first_bid': 50,
        'currently': 85.50,
        'seller': 'Mom', // this might have to change
        'category': [
            {'name': 'ABC'},
            {'name': 'DEF'},
            {'name': 'GHI'},
        ],
        'address': {
            'address_name': 'Yellow Cafe',
            'Street_name': 'Mpellou',
            'Street_number': '3',
            'Postal_code': 'ABC 12',
            'City': 'Athens',
            'Country': 'Greece'
        }
    }
]

export default function AuctionRating(){
    return(
        <>
            <Breadcrumbs sx={{paddingLeft: '1vw', paddingTop: '1vh'}}>
                <Link variant="button" href="/index">Αρχική</Link>
                <Typography variant="button">Αξιολόγηση Αγορασθέντων</Typography>
            </Breadcrumbs>
            <Typography sx={{paddingBottom: '2vh'}} variant="h1">Αξιολόγηση Αγορασθέντων Δημοπρασιών</Typography>
            <ItemAccordion items={items} case={'rating'} type={'bought'}/>
        </>
    )
}