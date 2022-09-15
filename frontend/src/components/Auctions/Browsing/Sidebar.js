import { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

import { SearchContext } from '../../../context/SearchContext';

function CategoryItem(props){
    console.log(props.disabled)
    return(
        <ListItem key={props.value} disablePadding>
            <ListItemButton disabled={props.disabled} onClick={() => props.callback(props.value)}>
                <ListItemIcon>
                    <Checkbox 
                        edge="start"
                        checked={props.checked}
                        tabIndex={-1}
                        disableRipple
                        disabled={props.disabled}
                    />
                </ListItemIcon>
                <ListItemText primary={props.value}/>
            </ListItemButton>
        </ListItem>
    )    
}

function Categories(){
    const [loaded, setLoaded] = useState(false)
    const [categories, setCategories] = useState([])

    const { isQuerying, queryCategories, checked } = useContext(SearchContext)

    const fetchCategories = () => {
        const headers = {
            'Content-Type': 'application/json',
        }

        axios.get('http://localhost:8000/auctions/categories/', { headers })
            .then((response) => {
                console.log(response.data)
                setCategories(response.data)
                setLoaded(true)
            })
    }

    useEffect(() => fetchCategories(), [])

    return(
        <>
            {loaded ? 
                    <List>
                        {
                            categories.map((category) => 
                                <CategoryItem 
                                    key={category.name}
                                    value={category.name}
                                    callback={queryCategories}
                                    checked={checked.indexOf(category.name) !== -1}
                                    disabled={isQuerying}
                                />
                            )
                        }
                    </List>                
                :
                <></>
            }
        </>
    )
}

function Search(){
    const { search, setSearch, setIsStringQuerying } = useContext(SearchContext)
    const [value, setValue] = useState('') // This is for the textbox's appearance, has nothing to do with the query value
    return(
        <>
            <Paper sx={{ paddingTop: '2vh', display: 'flex', alignItems: 'center'}}>
                <IconButton sx={{p: '10 px'}}>
                    <SearchIcon onClick={() => setIsStringQuerying(true)}/>
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Αναζήτηση..."
                    value={value}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter')
                            setIsStringQuerying(true)
                    }}
                    onChange={(event) => { setSearch(event.target.value); setValue(event.target.value); }}
                />
                {search !== null ? <ClearIcon onClick={() => {setSearch(null); setValue(''); setIsStringQuerying(true)}}/> : <></>} 
            </Paper>
        </>
    )
}

function PriceSearch(){
    const [from, setFrom] = useState('') // This is for the textbox's appearance, has nothing to do with the query value
    const [to, setTo] = useState('') // This is for the textbox's appearance, has nothing to do with the query value
    const [valueToClear, setValueToClear] = useState(false)

    const { setLowerBound, setUpperBound, setIsPriceQuerying } = useContext(SearchContext)

    return(
        <>
            <Stack alignItems="flex-start" spacing={1}>
                <Typography sx={{paddingLeft: '1vw', paddingTop: '1vw'}} variant="subtitle" component="h3">Εύρος Τιμής:</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <InputBase 
                            placeholder="Από"
                            endAdornment={<InputAdornment position="end">€</InputAdornment>}
                            value={from}
                            onChange={(event) => {
                                setFrom(event.target.value); 
                                setValueToClear(true);
                                setLowerBound(event.target.value);
                        }}/>
                    </Grid>
                    <Grid item xs={3}>
                        <InputBase 
                            placeholder="Έως"
                            endAdornment={<InputAdornment position="end">€</InputAdornment>}
                            value={to}
                            onChange={(event) => {
                                setTo(event.target.value);
                                setValueToClear(true);
                                setUpperBound(event.target.value);
                        }}/>
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-start">
                    <Grid item xs={3}>
                        <Button 
                            variant="outlined" 
                            disabled={!valueToClear} 
                            onClick={() => {
                                setFrom('');
                                setTo('');
                                setLowerBound(null);
                                setUpperBound(null);
                                setValueToClear(false);
                            }}>Εκκαθάριση</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button 
                            variant="contained"
                            disabled={!valueToClear}
                            onClick = {() => {setIsPriceQuerying(true)}}
                        >Αναζήτηση</Button>
                    </Grid>
                </Grid>
            </Stack>
        </>
    )
}

function Sidebar(){
    return(
        <Stack alignItems="flex-start" divider={<Divider flexItem/>} spacing={2}>
            <Search />
            <Typography sx={{paddingLeft: '2vw', paddingTop: '1vw'}} variant="subtitle" component="h3">Κατηγορίες</Typography>
            <Categories />
            <PriceSearch />
        </Stack>        
    )
}

export default Sidebar;