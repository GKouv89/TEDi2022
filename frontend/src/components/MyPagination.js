import Pagination from '@mui/material/Pagination'
import { useState, useContext, useEffect } from 'react'
import { PaginationContext } from '../context/PaginationContext'

function MyPagination(props){
    const { active, setActive } = useContext(PaginationContext);
    // console.log(active);
    // console.log(props.count)

    const onPageChange = (event, value) => {
        setActive(value)
    }

    return(
        <Pagination page={active} count={props.count} variant="outlined" showFirstButton showLastButton onChange={onPageChange} />
    )
}

export default MyPagination