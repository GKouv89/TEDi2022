import React from 'react'
import {Outlet, Navigate} from 'react-router-dom'

export default function PrivateRoute({children, ...rest}){
    const isAuthenticated = false;
    return(
        <>
            {isAuthenticated ? <Outlet /> : <Navigate to={"/"} replace/>}
        </>    
    )
}