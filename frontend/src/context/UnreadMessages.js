import { createContext, useState } from "react";

export const UnreadMessagesContext = createContext();

export function UnreadMessagesProvider({children}) {
    const [unread, setUnread] = useState(false)

    return(
        <UnreadMessagesContext.Provider value={{unread, setUnread}}>
            {children}
        </UnreadMessagesContext.Provider>
    )
}