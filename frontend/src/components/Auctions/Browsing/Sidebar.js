import { useState, useEffect } from 'react'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

const categories = [
    'Technology',
    'Laptops',
    'MSI',
    'Gaming'
];

function CategoryItem(props){
    return(
        <ListItem key={props.value} disablePadding>
            <ListItemButton onClick={() => props.callback(props.value)}>
                <ListItemIcon>
                    <Checkbox 
                        edge="start"
                        checked={props.checked}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText primary={props.value}/>
            </ListItemButton>
        </ListItem>
    )    
}

function Categories(){
    const [checked, setChecked] = useState([]);

    const handleToggle = (value) => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
    }
    return(
        <>
            <List>
                {
                    categories.map((category) => 
                        <CategoryItem 
                            key={category}
                            value={category}
                            callback={handleToggle}
                            checked={checked.indexOf(category) !== -1}
                        />
                    )
                }
            </List>    
            <Button />
        </>
    )
}

function Sidebar(){
    return(
        <Stack sx={{width: '33vw'}} alignItems="flex-start" divider={<Divider flexItem/>} spacing={2}>
            <Typography sx={{paddingLeft: '2vw', paddingTop: '1vw'}} variant="subtitle" component="h3">Κατηγορίες</Typography>
            <Categories />
        </Stack>        
    )
}

export default Sidebar;