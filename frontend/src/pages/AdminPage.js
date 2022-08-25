import MyPagination from '../components/MyPagination'
import UsersCard from '../components/AdminPage/UsersCard'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminPage(){
    const page_size = 10; // fixed value to paginate
    const [page_count, setPageCount] = useState(null)
    console.log(page_count)
    // const results = [ // dummy data atm, will come from request
    //     {"username": "gina", "isPending": true},
    //     {"username": "takis", "isPending": true},
    //     {"username": "voula", "isPending": false},
    //     {"username": "marina", "isPending": false},
    //     {"username": "dimitris", "isPending": true},
    // ]

    const [fetchResults, setFetchResults] = useState(null)
    const [count, setCount] = useState(null)
    const [loaded, setloaded] = useState(false)

    const fetchData = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
        axios.get('http://localhost:8000/users/', { headers })
            .then((response) => {
                console.log(response.data.results)
                setFetchResults(response.data.results)
                setCount(response.data.count)
                setPageCount(count/page_size + 1)
                setloaded(true)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {fetchData()}, [])

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
                                <UsersCard results={fetchResults}/>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <MyPagination count={page_count}/>
                        </Col>
                    </Row>
                </> 
                : <></>}
        </Container>
    )
}