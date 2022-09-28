import { createContext, useState } from "react";

export const EditAuctionContext = createContext();

export function EditAuctionProvider({children}) {
    const [editing, setEditing] = useState(false)
    const [Images, setImages] = useState([])
    const [loadedImages, setLoadedImages] = useState(false)
    const [itemID, setItemID] = useState(null)
    return(
        <EditAuctionContext.Provider value={{editing, setEditing, Images, setImages, loadedImages, setLoadedImages, itemID, setItemID}}>
            {children}
        </EditAuctionContext.Provider>
    )
}