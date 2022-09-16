import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Tab from 'react-bootstrap/Tab'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function UsersCard(props){
    console.log(useParams())
    const [usersState, setUsersState] = useState([])
    const [tabContent, setTabContent] = useState([])
    const [loaded, setLoaded] = useState(false)

    let usersStateTemp = []
    const initializeUsersStatus = () => {
        for(let i = 0; i < props.results.length; i++){
            usersStateTemp.push(props.results[i].isPending);
        }  
        setUsersState(usersStateTemp)
    }

    const createTabContent = () => {
        let tempTabContent = [];
        for(let i = 0; i < props.results.length; i++){
            tempTabContent.push(<Tab.Pane eventKey={'#link' + i}>
                <UserInfo idx={i} result={props.results[i]} callback={updateUsersStatus}/>
            </Tab.Pane>);
        }
        setTabContent(tempTabContent)
    }

    useEffect(() => {
        if(usersState.length == 0){
            initializeUsersStatus()
            createTabContent()
            console.log(tabContent)
            setLoaded(true)
        }
    }, [])

    const updateUsersStatus = () => {
        setLoaded(false)
        props.callback(false)
        setLoaded(true)
    }

    return(
        <>
        {loaded ? <>
                <Tab.Container activeKey={props.activeTab} onSelect={(tab) => props.setActiveTab(tab)}>
                    <Row>
                        <Col xs={4}>
                            <ListGroup>
                                {props.results.map((result, idx) => <UserCard key={idx} idx={idx} username={result.username} isPending={usersState[idx]} />)}
                            </ListGroup>
                        </Col>
                        <Col xs={8}>
                            <Tab.Content>
                                {tabContent}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>   
            </>: <></>}
        </>
    )
}

function UserCard(props){
    return(
        <ListGroup.Item action href={'#link' + props.idx}>
            <Container className="align-items-start">
                <Row>
                    <Col>
                        {props.username}
                    </Col>
                    <Col>
                        <Badge pill bg={props.isPending ? "danger" : "success"}>
                            {props.isPending ? 'Εκκρεμεί' : 'Εγκρίθηκε'}
                        </Badge>
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    )
}

function UserInfo(props){
    const [isPending, setIsPending] = useState(props.result.isPending)

    const approveUser = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
        const data = {
            'username': `${props.result.username}`,
            'isPending': false
        }
        axios.patch(`http://localhost:8000/users/${props.result.username}/`, data, { headers })
            .then(() => {setIsPending(false); props.callback()})
            .catch(err => console.log(err)) 
    }

    return(
        <>
            <p>Όνομα χρήστη: {props.result.username}</p>
            <p>Όνομα: {props.result.first_name}</p>
            <p>Επώνυμο: {props.result.last_name}</p>
            <p>Διεύθυνση ηλεκτρονικού ταχυδρομείου: {props.result.email}</p>
            <p>Τηλέφωνο Επικοινωνίας: {props.result.phone_number}</p>
            <p>Αριθμός Φορολογικού Μητρώου: {props.result.tin}</p>
            <p>Διεύθυνση: {props.result.Address.Street_name + ' ' + props.result.Address.Street_number + ', ' + props.result.Address.Postal_code + ', ' + props.result.Address.City + ', ' + props.result.Address.Country}</p>
            {isPending ? <Button variant="success" onClick={() => approveUser()}>Έγκριση χρήστη</Button>: <Button variant="outline-success" disabled>Εγκρίθηκε</Button>}
        </>
    )
}

export default UsersCard