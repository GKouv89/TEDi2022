import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({children}){
    let [user, setUser] = useState(null) // Will require a check for an existing token so user won't be logged out when they open the browser
    
    let loginUser = () =>{
        // Body will change with completion of backend auth
        // This will also be async
        setUser('gina')
    }

    let logoutUser = () => {
        setUser(null)
    }

    let contextData = {
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser
    }
    return(
        <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
    )
}