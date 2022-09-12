import { createContext, useState, useEffect } from "react";

export const PaginationContext = createContext();

export function PaginationProvider({children}) {
    const [active, setActive] = useState(1)

    return(
        <PaginationContext.Provider value={{active, setActive}}>
            {children}
        </PaginationContext.Provider>
    )
}