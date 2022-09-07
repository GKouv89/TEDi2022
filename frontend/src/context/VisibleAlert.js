import { createContext, useState } from "react";

export const AlertContext = createContext();

export function AlertProvider({children}) {
    const [visible, setVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    return(
        <AlertContext.Provider value={{visible, setVisible, alertMessage, setAlertMessage}}>
            {children}
        </AlertContext.Provider>
    )
}