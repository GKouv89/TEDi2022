import { useState } from 'react'

import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import axios from 'axios'

const createAndDownloadXML = (limit, offset, number) => {
    axios.get(`https://localhost:8000/auctions/xml/?limit=${limit}&offset=${offset}`)
        .then((response) => {
            // console.log(response.data)
            let DTDdataStr = "data:text/xml;charset=utf-8," + encodeURIComponent(response.data)
            let downloadAnchorNode = document.createElement('a')
            downloadAnchorNode.setAttribute("href", DTDdataStr)
            let fileName = `items-${number}.xml`
            downloadAnchorNode.setAttribute("download", fileName)
            document.body.appendChild(downloadAnchorNode)
            downloadAnchorNode.click()
            downloadAnchorNode.remove()
        })
        .catch((err) => console.log(err))
}


const createSingularJSON = (data) => {
    const dtdData = {
        'id': data.id,
        'name': data.name,
        'category': data.category.map((cat) => (cat.name)),
        'currently': data.currently,
        'first_bid': data.first_bid,
        'buy_price': data.buy_price,
        'number_of_bids': data.number_of_bids,
        'bids': (data.items_bids.map((bid) => ({'bidder': {'userID': bid.bidder.username, 'rating': bid.bidder.bidder_rating, 'location': bid.bidder.Address.address_name, 'country': bid.bidder.Address.Country}, 'time': bid.time, 'amount': bid.amount}))),
        'location': data.address.address_name,
        'country': data.address.Country,
        'started': data.started,
        'ends': data.ended,
        'seller': {
            'userID': data.seller.username,
            'rating': data.seller.seller_rating
        },
        'description': data.description
    }
    return data
}

const getAndDownloadJSON = (limit, offset, number) => {
    axios.get(`https://localhost:8000/auctions/json/?limit=${limit}&offset=${offset}`)
        .then((response) => {
            let dataArr = []
            response.data.results.map((result) => dataArr.push(createSingularJSON(result)))
            console.log(dataArr.length)
            let dtdData = {
                'items': dataArr
            }
            let DTDdataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dtdData))
            let downloadAnchorNode = document.createElement('a')
            downloadAnchorNode.setAttribute("href", DTDdataStr)
            let fileName = `items-${number}.json`
            downloadAnchorNode.setAttribute("download", fileName)
            document.body.appendChild(downloadAnchorNode)
            downloadAnchorNode.click()
            downloadAnchorNode.remove()
        })
        .catch((err) => console.log(err))
}

export function MassFileExportPage(){
    const pageSize = 500
    const [itemCount, setItemCount] = useState(0)
    const [fileCount, setFileCount] = useState(0)
    const [fileType, setFileType] = useState('XML')

    const handleChange = (event) => {
        setItemCount(event.target.value)
        setFileCount(Math.ceil(event.target.value/pageSize))
    }

    const handleClick = () => {
        if(itemCount == 0){
            return            
        }
        let limit = itemCount;
        let offset = 0;
        let filesCreated = 0;
        if(fileCount == 1){
            fileType == "XML" ? createAndDownloadXML(limit, offset, 0) : getAndDownloadJSON(limit, offset, 0)
        }else{
            while(limit > pageSize){
                fileType == "XML" ? createAndDownloadXML(pageSize, offset, filesCreated) : getAndDownloadJSON(pageSize, offset, filesCreated)
                offset += pageSize
                limit -= pageSize
                filesCreated++
            }    
            fileType == "XML" ? createAndDownloadXML(limit, offset, filesCreated) : getAndDownloadJSON(limit, offset, filesCreated)
        }
    }

    return(
        <>
            <Grid container sx={{paddingTop: '2vh'}} spacing={2} justifyContent="flex-start">
                <Grid item xs={12}>
                    <Breadcrumbs sx={{paddingLeft: '2vw'}}>
                        <Link variant="button" href="/index">Αρχική</Link>
                        <Typography variant="button">Εξαγωγή Δεδομένων</Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h1">Εξαγωγή Δεδομένων Δημοπρασιών</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h3" component="body1">Εισάγετε αριθμό δημοπρασιών προς εξαγωγή:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <TextField 
                        autoFocus
                        onChange={handleChange}
                        fullWidth
                        size="large"
                        variant="filled"
                        helperText={itemCount != 0 ? "" : "Πρέπει τουλάχιστον να εξάγετε τα δεδομένα για 1 δημοπρασία."}
                    />             
                    <Alert severity="info" sx={{visibility : fileCount != 0 ? 'visible' : 'hidden'}}>
                        Θα κατεβάσετε {fileCount} {fileCount == 1 ? 'αρχείο' : 'αρχεία'}
                    </Alert>       
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h3" component="body1">Επιλέξτε τύπο αρχείου:</Typography>
                </Grid>
                <Grid item xs={5}>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={fileType}
                        onChange={(event) => setFileType(event.target.value)}
                    >
                        <FormControlLabel value="XML" control={<Radio />} label="XML" />
                        <FormControlLabel value="JSON" control={<Radio />} label="JSON" />
                    </RadioGroup>
                </Grid>
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{width: '100%'}} size="large" variant="contained" onClick={handleClick}>Εξαγωγή</Button>
                </Grid>
                <Grid item xs={4}>
                </Grid>
            </Grid>
        </>
    )
}