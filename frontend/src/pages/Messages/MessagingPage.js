import {Stack, Grid, Tabs, Tab, Typography, Button, TextField } from '@mui/material'
import AuthContext from '../../context/AuthContext'
import { useEffect, useState, useContext } from 'react'
import {Badge, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Alert} from '@mui/material'
import MyPagination from '../../components/MyPagination'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import * as Yup from 'yup'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import { InputBase } from '@mui/material'
import axios from 'axios';
import moment from 'moment';
import { PaginationContext } from '../../context/PaginationContext'
import { UnreadMessagesContext } from '../../context/UnreadMessages'

function MessagePreview(props){
    const [type, setType] = useState(props.type)

    console.log(props.type)

    let folder = getFolder(props.message)
    let bold
    if (folder === 'sent/') {
        bold = false
    } else {
        bold = !props.message.read
    }

    return(
        <TableRow onClick={() => {props.clickOnMessage(true, props.message)}}>
            <TableCell sx={{fontSize: 'large', fontWeight: !bold ? 'normal' : '900'}}>{props.type == 'Sent' ? `To ${props.message.receiver.username}` : props.message.sender.username}</TableCell>
            <TableCell sx={{fontSize: 'large', fontWeight: !bold ? 'normal' : '900'}} align="right">{props.message.subject}</TableCell>
            <TableCell sx={{fontSize: 'large', fontWeight: !bold ? 'normal' : '900'}} align="right">{props.message.date}</TableCell>
        </TableRow>
    )
}

function MessageFolder(props){
    const page_count = 12;
    const [folder, setFolder] = useState(props.value)
    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const { active, setActive,} = useContext(PaginationContext);
    const { unread, setUnread} = useContext(UnreadMessagesContext);

    const headers = {
        "Authorization": `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    }
    const d = {}
    const url = 'https://localhost:8000/messages/'

    useEffect(() => {
        setFolder(props.value)
        setActive(1)

        axios.get(url + 'inbox/unreadmessages/', {headers}, d)
            .then((r)=> {
                console.log(r.data.unread)
                setUnread(r.data.unread)
            })
    }, [props])

    useEffect(() => {
         
        if(folder == 'Inbox') {
            axios.get(url + 'inbox/'+ '?page=' + active, {headers}, d)
            .then((r) => {
                console.log(r.data)
                setData(r.data)
                setLoaded(true)
                console.log(loaded)
            })
            .catch(() => {})
        }else{
            axios.get(url + 'sent/'+ '?page=' + active, {headers}, d) 
            .then((r) => {
                console.log(r.data)
                setData(r.data)
                setLoaded(true)
            })
            .catch(() => {})
        }
        
    }, [folder, active])

    return(
        <>{
            loaded &&
            <Stack alignItems="center" justifyContent="center" spacing={2}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold'}}>{folder == 'Inbox' ? "Αποστολέας" : "Παραλήπτης"}</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}} align="right">Θέμα</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}} align="right">Ημερομηνία</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.results.map((message, idx) => <MessagePreview clickOnMessage={props.clickOnMessage} type={folder} key={idx} message={message}/>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                <MyPagination count={Math.ceil(data.count/page_count)}/>
            </Stack>
        }</>
    )
}

const isReceiver = (message) => {
    let username = localStorage.getItem('username')
    if(message.receiver.username === username) {
        return true
    }else {
        return false
    }
}

const getFolder = (message) => {
    let folder 
    let username = localStorage.getItem('username')
    if(message.receiver.username === username) {
        folder = "inbox/"
    }else if (message.sender.username === username) {
        folder = "sent/"
    }
    return folder
} 

const handleDeleteMessage = (message) => {
    const url = 'https://localhost:8000/messages/'
    let folder = getFolder(message)

    axios.delete(url + folder + message.id + '/delete/',
        {
            headers: {
                "Authorization": `Token ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        })
}

function Message(props){
    return(
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <Button variant="outlined" onClick={() => props.clickOnMessage(false, null)} startIcon={<ArrowBackIcon />}>Πίσω</Button>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="h2">{props.message.subject}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Button variant="outlined" startIcon={<DeleteIcon />} onClick={()=>handleDeleteMessage(props.message)}>Διαγραφή Μηνύματος</Button>
            </Grid>
            <Grid item xs>
                <Typography variant="button">{props.fromFolder == 'Inbox' ? `Από ${props.message.sender.username}`: `Πρός ${props.message.receiver.username}`}</Typography>
            </Grid>
            <Grid item xs>
                <Typography variant="button">{props.message.date}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <Typography variant="body1">{props.message.body}</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

const schema = Yup.object().shape(
    {
        subject: Yup.string()
            .required('Υποχρεωτικό Πεδίο'),
        receiver: Yup.string()
            .required('Υποχρεωτικό Πεδίο'),
        body: Yup.string()
            .required('Το σώμα του μηνύματος δεν μπορεί να είναι κενό.')
    }
)

const initialValues = {
    subject: '',
    receiver: '',
    body: ''
}

function MessageCreation(props){
    const [receiverExists, setReceiverExists] = useState(true)  

    return(
        <>
            <Button sx={{display: 'flex', alignItems: 'flex-start', paddingLeft: '1vw'}} variant="outlined" onClick={() => props.escapeMsgCreation('Inbox')} startIcon={<ArrowBackIcon />}>Πίσω</Button>
            <Stack spacing={3} sx={{paddingTop: '2vh'}}>
                <Formik
                    validationSchema={schema}
                    onSubmit={
                        (values) => {
                            console.log('submitted')
                            console.log(values)
                            let myobject = values
                            let current_date = moment()._d
                            myobject.date = current_date
                            myobject.sender = { "username": localStorage.getItem('username')}
                            myobject.receiver = { "username": myobject.receiver }
                            console.log(myobject)

                            axios.post(
                                'https://localhost:8000/messages/sent/',
                                myobject,
                                {
                                    headers: {
                                        "Authorization": `Token ${localStorage.getItem('token')}`,
                                        "Content-Type": "application/json"
                                    }
                                }
                            )
                            .then((r)=> {
                                setReceiverExists(true);
                                props.escapeMsgCreation('Sent')
                            })
                            .catch((e) => {
                                if (e.response.status === 400) {
                                    setReceiverExists(false)
                                } else {
                                    setReceiverExists(true)
                                }
                            })
                        }
                    }
                    initialValues={initialValues}
                >
                {props => (
                    <>
                        <TextField 
                            autoFocus
                            name="receiver" 
                            label="Παραλήπτης *"
                            helperText={props.touched.receiver && props.errors.receiver ? props.errors.receiver : ''}
                            variant="outlined"
                            {...props.getFieldProps('receiver')}
                        />
                        {
                            receiverExists ? null : <Alert severity="error">Ο παραλήπτης δεν είναι έγκυρος. Προσπαθήστε ξανά.</Alert>
                        }
                        <TextField 
                            name="subject" 
                            label="Θέμα *"
                            helperText={props.touched.subject && props.errors.subject ? props.errors.subject : ''}
                            variant="outlined"
                            {...props.getFieldProps('subject')}
                        />
                        <TextField
                            name="body" 
                            label="Μήνυμα *"
                            multiline
                            maxRows={20}
                            minRows={15}
                            helperText={props.touched.body && props.errors.body ? props.errors.body : ''}
                            variant="filled"
                            {...props.getFieldProps('body')}
                        />
                        <Button variant="contained" type="submit" onClick={props.handleSubmit}>Αποστολή Μηνύματος</Button>
                    </>
                )}
                </Formik>
            </Stack>
        </>
    )
}

export default function MessagingPage(){
    const [tabName, setTabName] = useState('Inbox')
    const [messageViewing, setMessageViewing] = useState(false)
    const [currMessage, setCurrMessage] = useState(null)
    const [msgCreation, setMsgCreation] = useState(false)
    const { unread, setUnread} = useContext(UnreadMessagesContext)

    const handleChange = (event, newValue) => {
        setTabName(newValue);
        if(newValue == 'New Message')
            setMsgCreation(true)
        else
            setMsgCreation(false)
    };

    const clickOnMessage = (boolval, msg) =>{
        setMessageViewing(boolval)
        setCurrMessage(msg)
        
        if(isReceiver(msg)) {   //if user views an inbox message check this message as read
            let url = 'https://localhost:8000/messages/'
            let folder = getFolder(msg)
            const headers = {
                "Authorization": `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
            axios.patch(url + folder + msg.id +'/', {}, {headers})
            let d = {}
            //check if there is at least one unread message
            axios.get(url + 'inbox/unreadmessages/', {headers}, d)
            .then((r)=> {
                console.log(r.data.unread)
                setUnread(r.data.unread)
            })
        }
    }

    const escapeMsgCreation = (newValue) => {
        setMsgCreation(false)
        setTabName(newValue)
    }    

    return(
        <>
            <Grid container sx={{paddingTop: '2vh'}} >
                <Grid item xs={12}>
                    <Typography variant="h2" component="h1">Τα Μηνύματά Μου</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Tabs
                        orientation="vertical"
                        value={tabName}
                        onChange={handleChange}
                    >                        
                        <Tab icon={<AddIcon />} iconPosition="start" label="Δημιουργία" value={'New Message'} />
                        <Tab label="Εισερχόμενα" value={'Inbox'} />
                        <Tab label="Απεσταλμένα" value={'Sent'}/>
                    </Tabs>
                </Grid>
                <Grid item xs={11}>
                    {msgCreation ? <MessageCreation escapeMsgCreation={escapeMsgCreation}/> : !messageViewing ? <MessageFolder value={tabName} clickOnMessage={clickOnMessage} /> : <Message clickOnMessage={clickOnMessage} fromFolder={tabName} message={currMessage}></Message>}
                </Grid>
            </Grid>
        </>
    )
}