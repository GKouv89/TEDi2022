import { useContext, createContext, useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AlertContext } from "./VisibleAlert"; 

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({children}){
    let [user, setUser] = useState(localStorage.getItem('username'))
    let [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin'))
    let [isPending, setIsPending] = useState(localStorage.getItem('isPending'))
    let [token, setToken] = useState(localStorage.getItem('token'))
 
    let {visible, setVisible, _, setAlertMessage} = useContext(AlertContext);

    let navigate = useNavigate()
    const didMount = useRef(false)

    useEffect(() => {
        if(!didMount.current){
            didMount.current = true
            return
        }
        if(!user){
            navigate('../', {replace: true})
        }else if(isAdmin){
            navigate('../admin', {replace: true})
        }else if(isPending){
            navigate('../pending', {replace: true})
        }else{
            navigate('../index', {replace: true})
        }
    }, [user, isAdmin, isPending])

    let signupUser = (username, token, is_staff, isPending) => {
        console.log('signupUser')
        setUser(username)
        setToken(token)
        setIsAdmin(is_staff)
        setIsPending(isPending)

        window.localStorage.setItem("token", token)
        window.localStorage.setItem("username", username)
        window.localStorage.setItem("isAdmin", is_staff)
        window.localStorage.setItem("isPending", isPending)
    }

    let loginUser = (e) =>{
        e.preventDefault()
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
                setIsAdmin(r.data.user_data.is_staff)
                setIsPending(r.data.user_data.isPending)
                window.localStorage.setItem("token", r.data.token)
                window.localStorage.setItem("username", r.data.user_data.username)
                window.localStorage.setItem("isAdmin", r.data.user_data.is_staff)
                window.localStorage.setItem("isPending", r.data.user_data.isPending)
                setVisible(false)
            })
            .catch(error => {
                console.log(error.response.status)
                //check if the server replied with "Bad Request 400"
                if (error.response.status === 400) {
                    if (typeof error.response.data.non_field_errors !== "undefined") {
                        //given username & password are incorrect
                        setAlertMessage("Το όνομα χρήστη ή/και ο κωδικός που εισάγατε είναι λάθος.")
                        setVisible(true)
                    }
                    if (typeof error.response.data.username !== "undefined" || typeof error.response.data.password !== "undefined") {
                        //username or password were not given
                        setAlertMessage("Απαιτείται όνομα χρήστη και κωδικός πρόσβασης χρήστη.")
                        setVisible(true)
                    }
                }
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
                setIsAdmin(null)
                setIsPending(null)
                localStorage.removeItem("username")
                localStorage.removeItem("token")
                localStorage.removeItem("isAdmin")
                localStorage.removeItem("isPending")
            })
            .catch(err => console.log(err))
    }

    let contextData = {
        user: user,
        isAdmin: isAdmin,
        isPending: isPending,
        token: token,
        signupUser: signupUser,
        loginUser: loginUser,
        logoutUser: logoutUser
    }
    return(
        <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
    )
}