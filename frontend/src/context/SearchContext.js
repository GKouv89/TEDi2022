import { useContext, createContext, useState, useRef, useEffect } from "react";
import axios from 'axios';

export const SearchContext = createContext();

export function SearchProvider({children}){
    const base_url = 'http://localhost:8000/auctions/'
    const pageSize = 12; // Fixed number, same as backend

    const [url, setUrl] = useState(base_url)
    const [checked, setChecked] = useState([])
    const [isQuerying, setIsQuerying] = useState(false);

    const [data, setData] = useState(null)
    const [count, setCount] = useState(0)
    const [loaded, setLoaded] = useState(false)

    const queryCategories = (value) => {
        setIsQuerying(true)
        setLoaded(false)
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        fetchFilteredItems(newChecked)
    }

    const fetchFilteredItems = (checked) => {
        const headers = {
            'Content-Type': 'application/json',
        }

        let newUrl = base_url + '?'
        checked.forEach((check) => newUrl += `category=${check}&`)
        // Here, more filters for price, name and description to come
        newUrl = newUrl.slice(0, -1)
        console.log(newUrl)
        setUrl(newUrl)
        axios.get(newUrl, { headers })
            .then((response) => {
                console.log(response.data.results)
                setData(response.data.results)
                setCount(Math.ceil(response.data.count/pageSize))
            })
            .then(() => {setIsQuerying(false); setLoaded(true)})
    }

    const fetchData = (pageNo) => {
        const headers = {
            'Content-Type': 'application/json',
        }
        let paginatedUrl
        if(url === base_url)
            paginatedUrl = url + `?page=${pageNo}`
        else
            paginatedUrl = url + `&page=${pageNo}`
        axios.get(paginatedUrl, { headers })
            .then((response) => {
                console.log(response.data.count)
                setData(response.data.results)
                setLoaded(true)
                setCount(Math.ceil(response.data.count/pageSize))
            })
            .catch(err => console.log(err))
    }

    const paginationCallback = (pageNo) =>{
        setLoaded(false)
        fetchData(pageNo)
    }

    // const didMount = useRef(false)

    // useEffect(() => {
    //     if(!didMount.current){
    //         didMount.current = true
    //         return
    //     }
    //     if(!user){
    //         navigate('../', {replace: true})
    //     }else if(isAdmin){
    //         navigate('../admin', {replace: true})
    //     }else if(isPending == 'true'){
    //         navigate('../pending', {replace: true})
    //     }else{
    //         navigate('../index', {replace: true})
    //     }
    // }, [user, isAdmin, isPending])

    let contextData = {
        checked: checked,
        isQuerying: isQuerying,
        queryCategories: queryCategories,
        fetchFilteredItems: fetchFilteredItems,
        fetchData: fetchData,
        paginationCallback: paginationCallback,
        data: data, 
        count: count,
        loaded: loaded
    }

    return(
        <SearchContext.Provider value={contextData}>{children}</SearchContext.Provider>
    )
}