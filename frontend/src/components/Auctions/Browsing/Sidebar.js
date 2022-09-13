import { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

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

function Sidebar(){
    return(
        <Stack alignItems="flex-start" divider={<Divider flexItem/>} spacing={2}>
            <Typography sx={{paddingLeft: '2vw', paddingTop: '1vw'}} variant="subtitle" component="h3">Κατηγορίες</Typography>
            <Categories />
        </Stack>        
    )
}

export default Sidebar;