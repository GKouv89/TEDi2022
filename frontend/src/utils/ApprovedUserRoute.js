import React, { useContext } from 'react'
import {Outlet, Navigate} from 'react-router-dom'

import AuthContext from '../context/AuthContext'

export default function ApprovedUserRoute({children, ...rest}){
    let {isPending} = useContext(AuthContext)
    console.log(isPending)
    console.log(typeof isPending)
    return(
        <>
            {isPending == 'false' ? <Outlet /> : <Navigate to={"/warning"} replace/>}
        </>    
    )
}