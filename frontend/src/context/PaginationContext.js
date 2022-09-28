import { createContext, useState, useEffect } from "react";

export const PaginationContext = createContext();

export function PaginationProvider({children}) {
    const [active, setActive] = useState(1)
    // console.log(active)
    return(
        <PaginationContext.Provider value={{active, setActive}}>
            {children}
        </PaginationContext.Provider>
    )
}