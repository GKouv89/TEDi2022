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
                {search !== null ? <ClearIcon onClick={() => {console.log('here'); setSearch(null); setValue(''); setIsStringQuerying(true)}}/> : <></>} 
            </Paper>
        </>
    )
}

function Sidebar(){
    return(
        <Stack alignItems="flex-start" divider={<Divider flexItem/>} spacing={2}>
            <Search />
            <Typography sx={{paddingLeft: '2vw', paddingTop: '1vw'}} variant="subtitle" component="h3">Κατηγορίες</Typography>
            <Categories />
        </Stack>        
    )
}

export default Sidebar;