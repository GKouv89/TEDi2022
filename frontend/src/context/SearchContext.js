import { useContext, createContext, useState, useRef, useEffect } from "react";
import axios from 'axios';
import { PaginationContext } from "./PaginationContext";

export const SearchContext = createContext();

export function SearchProvider({children}){
    const { active, setActive} = useContext(PaginationContext)

    const base_url = 'https://localhost:8000/auctions/'
    const pageSize = 12; // Fixed number, same as backend

    const [url, setUrl] = useState(base_url)
    const [checked, setChecked] = useState([])
    const [isQuerying, setIsQuerying] = useState(false);
    
    const [search, setSearch] = useState(null)
    const [isStringQuerying, setIsStringQuerying] = useState(false)

    const [data, setData] = useState(null)
    const [count, setCount] = useState(0)
    const [loaded, setLoaded] = useState(false)

    const [from, setLowerBound] = useState(null)
    const [to, setUpperBound] = useState(null)
    const [isPriceQuerying, setIsPriceQuerying] = useState(false)

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
    }

    const fetchFilteredItems = () => {
        const headers = {
            'Content-Type': 'application/json',
        }

        let newUrl = base_url + '?'
        checked.forEach((check) => newUrl += `category=${check}&`)
        // Here, more filters for price to come
        if(search !== null)
            newUrl += `search=${search}&`
        if(from !== null)
            newUrl += `from=${from}&`
        if(to !== null)
            newUrl += `to=${to}&`
        newUrl = newUrl.slice(0, -1) // Remove trailing &
        console.log(newUrl)
        setUrl(newUrl)
        axios.get(newUrl, { headers })
            .then((response) => {
                console.log(response.data.results)
                setData(response.data.results)
                setCount(Math.ceil(response.data.count/pageSize))
            })
            .then(() => {setIsQuerying(false); setLoaded(true); setIsStringQuerying(false); setIsPriceQuerying(false);})
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

    // const paginationCallback = (pageNo) =>{
    //     setLoaded(false)
    //     fetchData(pageNo)
    // }

    useEffect(() => {setLoaded(false); fetchData(active)}, [active])

    useEffect(() => fetchFilteredItems(), [checked])
    
    useEffect(() => {
        if(isStringQuerying)
            fetchFilteredItems()
    }, [isStringQuerying])

    useEffect(() => {
        if(isPriceQuerying)
            fetchFilteredItems()
    }, [isPriceQuerying])

    let contextData = {
        checked: checked,
        isQuerying: isQuerying,
        data: data, 
        count: count,
        loaded: loaded,
        search: search,
        setSearch: setSearch,
        setIsStringQuerying: setIsStringQuerying,
        setIsPriceQuerying: setIsPriceQuerying,
        queryCategories: queryCategories,
        fetchFilteredItems: fetchFilteredItems,
        fetchData: fetchData,
        // paginationCallback: paginationCallback,
        setLowerBound: setLowerBound,
        setUpperBound: setUpperBound
    }

    return(
        <SearchContext.Provider value={contextData}>{children}</SearchContext.Provider>
    )
}