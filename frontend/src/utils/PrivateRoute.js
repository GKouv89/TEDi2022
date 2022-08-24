import React, { useContext } from 'react'
import {Outlet, Navigate} from 'react-router-dom'

import AuthContext from '../context/AuthContext'

export default function PrivateRoute({children, ...rest}){
    // const isAuthenticated = false;
    let {user} = useContext(AuthContext)
    return(
        <>
            {user ? <Outlet /> : <Navigate to={"/warning"} replace/>}
        </>    
    )
}