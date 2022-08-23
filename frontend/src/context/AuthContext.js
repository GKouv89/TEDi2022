import { createContext, useState, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({children}){
    let [user, setUser] = useState(localStorage.getItem('username'))
    let [token, setToken] = useState(localStorage.getItem('token'))

    let loginUser = (e) =>{
        // Body will change with completion of backend auth
        // This will also be async

        e.preventDefault()
        console.log("djkfnjkdgjfdb")
        console.log(e.target.username.value)
        console.log(e.target.password.value)

        axios.post('http://localhost:8000/login/', 
            {"username": e.target.username.value, "password": e.target.password.value}, 
            {Headers: {'Content-Type': 'application/json'}})
            .then((r) => {
                console.log(r.data)
                //keep username and token in local storage and states 'user' and 'token'
                setUser(r.data.user_data.username)
                setToken(r.data.token)
                window.localStorage.setItem("token", r.data.token)
                window.localStorage.setItem("username", r.data.user_data.username)
            })

    }

    let logoutUser = () => {
        let authtoken = localStorage.getItem('token')
        console.log(authtoken)
        
        const data = {}
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authtoken}`
        }

        axios.post('http://localhost:8000/logout/', data, {headers})
            .then(() => {
                setToken(null)
                setUser(null)
                localStorage.removeItem("username")
                localStorage.removeItem("token")
            })
            .catch(err => console.log(err))

        
    }

    let contextData = {
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser,
        token: token
    }
    return(
        <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
    )
}