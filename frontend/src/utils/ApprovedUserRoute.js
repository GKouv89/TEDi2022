import React, { useContext } from 'react'
import {Outlet, Navigate} from 'react-router-dom'

import AuthContext from '../context/AuthContext'

export default function PrivateRoute({children, ...rest}){
    let {isPending} = useContext(AuthContext)
    return(
        <>
            {!isPending ? <Outlet /> : <Navigate to={"/warning"} replace/>}
        </>    
    )
}