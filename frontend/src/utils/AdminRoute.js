import React, { useContext } from 'react'
import {Outlet, Navigate} from 'react-router-dom'

import AuthContext from '../context/AuthContext'

export default function AdminRoute({children, ...rest}){
    let {isAdmin} = useContext(AuthContext)
    console.log('isAdmin:', isAdmin)
    console.log(isAdmin == 'true') 
    return(
        <>
            {isAdmin ? <Outlet /> : <Navigate to={"/warning"} replace/>}
        </>    
    )
}