import MyPagination from '../components/MyPagination'
import UsersCard from '../components/AdminPage/UsersCard'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

import { useState, useEffect, useContext } from 'react'
import axios from 'axios'

import { PaginationContext } from '../context/PaginationContext'

export default function AdminPage(){
    const page_size = 12; // fixed value to paginate
    const [page_count, setPageCount] = useState(null)
    console.log(page_count)

    const { active, setActive } = useContext(PaginationContext);

    const [fetchResults, setFetchResults] = useState(null)
    const [count, setCount] = useState(null)
    const [loaded, setloaded] = useState(false)
    const [activeTab, setActiveTab] = useState(0)

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
    }

    const fetchData = () => {
        axios.get('https://localhost:8000/users/?page=' + active, { headers })
            .then((response) => {
                console.log(response.data)
                console.log(response.data.results)
                setFetchResults(response.data.results)
                setCount(response.data.count)
                setPageCount(Math.ceil(response.data.count/page_size))
                setloaded(true)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {fetchData()}, [loaded])

    useEffect(() => setActive(1), [])

    useEffect(() => {
        console.log("active is " + active)
        axios.get('https://localhost:8000/users/?page=' + active, { headers })
            .then((response) => {
                console.log(response.data)
                console.log(response.data.results)
                setFetchResults(response.data.results)
                setCount(response.data.count)
                setPageCount(Math.ceil(response.data.count/page_size))
                setloaded(true)
            })
            .catch(err => console.log(err))
    } , [active])

    return(
        <Container>
            <Row>
                <h1>Σελίδα Διαχείρισης Χρηστών</h1>
            </Row>
            {loaded ?
                <>
                    <Row>
                        <Col>
                            <ListGroup>
                                <UsersCard results={fetchResults} callback={setloaded} activeTab={activeTab} setActiveTab={setActiveTab}/>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <MyPagination count={page_count} />
                        </Col>
                    </Row>
                </> 
                : <></>}
        </Container>
    )
}