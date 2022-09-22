import {Stack, Grid, Tabs, Tab, Typography, Button, TextField } from '@mui/material'
import AuthContext from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import {Badge, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Alert} from '@mui/material'
import MyPagination from '../../components/MyPagination'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import * as Yup from 'yup'
import { Formik } from 'formik'
import Form from 'react-bootstrap/Form'
import { InputBase } from '@mui/material'

const received = {
    count: 3,
    results: [
        {sender: 'dimitris', subject: 'geia', date: '19-08-2022 07:28', read: true, body: "Τρία πουλάκια κάθονταν"},
        {sender: 'dimitris', subject: 'antio', date: '19-08-2022 07:29', read: false, body: "Και πλέκανε πουλόβερ"},
        {sender: 'marika', subject: 'iaso kokla', date: '18-09-2022 18:09', read: true, body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquam, urna ut pellentesque tincidunt, felis urna interdum enim, eget accumsan nunc leo pulvinar odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum at turpis et mi condimentum malesuada vitae eget eros. In et elit pretium, maximus risus nec, scelerisque nunc. Duis vel imperdiet ex. Curabitur aliquam est elit, quis sollicitudin leo lobortis sit amet. Duis aliquam lorem ut ante facilisis luctus. Nam eros justo, dignissim vel auctor eget, scelerisque vel magna. Sed bibendum volutpat risus ac tristique. Aenean egestas rhoncus augue id ornare. Nunc cursus vel tortor id lacinia. \
        Cras placerat semper arcu, nec scelerisque lacus ultricies vitae. \
        Vestibulum ullamcorper, purus et tempus accumsan, tortor nibh semper lectus, id ullamcorper justo metus a sapien. In pulvinar, ante vel molestie aliquet, sapien urna cursus quam, ut malesuada nisi justo ac dui. Etiam ac vestibulum eros. Nulla dignissim ultrices dolor. Nunc ante ipsum, faucibus vehicula leo eget, porttitor condimentum sem. Vivamus eu lacinia ipsum. Vivamus at tortor magna. Ut porta neque eu mauris efficitur, sed ornare lectus consequat. Praesent erat ante, malesuada in libero ut, porta gravida lacus. Mauris malesuada lacus a elit tempor placerat. Aliquam scelerisque ut augue quis bibendum. \
        Pellentesque in euismod turpis. In et justo fringilla, blandit dolor sit amet, efficitur risus. Aenean sit amet laoreet arcu. Duis sollicitudin nisi dui, ut finibus tortor molestie quis. Aliquam facilisis eleifend sem ac volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et neque a ante feugiat efficitur. Donec et orci porttitor, porttitor augue vel, accumsan nunc. Nullam dignissim dui sit amet sem tincidunt gravida. Donec imperdiet, neque at dapibus pharetra, odio tortor ullamcorper sem, sed volutpat ex odio sed libero. Cras sodales tincidunt elit, et aliquet sem lacinia eu. \
        Morbi aliquam nunc in dui faucibus mattis. Suspendisse sed tristique nulla. Suspendisse quis dui ut turpis pulvinar blandit quis sed nibh. Duis tristique consequat luctus. Sed risus libero, cursus at nunc ac, fringilla varius ex. Donec pellentesque lorem eget elit finibus, vel laoreet dolor venenatis. Nullam vitae quam sed dolor volutpat commodo. Ut purus massa, finibus sit amet consequat semper, vestibulum dictum lectus. Cras justo diam, convallis non dolor vitae, porttitor rhoncus erat. Ut fermentum semper laoreet. \
        Phasellus mi turpis, dictum quis suscipit eu, rhoncus eget augue. Pellentesque molestie feugiat leo vel tincidunt. Curabitur pellentesque lobortis purus, vel tristique odio semper vitae. Nunc consequat, elit vitae semper convallis, mauris massa placerat felis, id tempus magna est id libero. Aliquam quis ipsum ac risus consectetur pretium. Nam pulvinar cursus libero, sit amet commodo eros varius et. Fusce posuere in nunc eu lobortis. Nulla efficitur mi eget diam luctus feugiat. Suspendisse condimentum ultricies purus et posuere. Vestibulum sagittis hendrerit iaculis. Suspendisse eget scelerisque felis, id volutpat eros. Nunc varius sem eget odio eleifend commodo. Curabitur varius, ex eget tristique gravida, diam ante vestibulum arcu, eu facilisis velit lectus eget elit. In hac habitasse platea dictumst. Mauris commodo dui at leo dictum, quis dapibus massa luctus. "}    
    ]    
}

const sent = {
    count: 3,
    results: [
        {receiver: 'dimitris', subject: 'kokle', date: '19-08-2022 07:30', read: true},
        {receiver: 'dimitris', subject: 'pame volta', date: '19-08-2022 07:39', read: false},
        {receiver: 'marika', subject: 'kane at ime plok', date: '18-09-2022 19:08', read: true}    
    ]    
}

function MessagePreview(props){
    const [type, setType] = useState(props.type)

    return(
        <TableRow onClick={() => {props.clickOnMessage(true, props.message)}}>
            <TableCell sx={{fontSize: 'large', fontWeight: !props.message.read ? '900' : 'normal'}}>{type == 'Sent' ? `To ${props.message.receiver}` : props.message.sender}</TableCell>
            <TableCell sx={{fontSize: 'large', fontWeight: !props.message.read ? '900' : 'normal'}} align="right">{props.message.subject}</TableCell>
            <TableCell sx={{fontSize: 'large', fontWeight: !props.message.read ? '900' : 'normal'}} align="right">{props.message.date}</TableCell>
        </TableRow>
    )
}

function MessageFolder(props){
    const page_count = 12;
    const [folder, setFolder] = useState(props.value)
    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        setLoaded(false)
        setFolder(props.value)
    }, [props])

    useEffect(() => {
        if(folder == 'Inbox') // replace with proper axios calls when API is ready
            setData(received)
        else
            setData(sent)
        setLoaded(true)
    }, [folder])

    return(
        <>{
            loaded &&
            <Stack alignItems="center" justifyContent="center" spacing={2}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold'}}>Αποστολέας</TableCell>
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
                <Button variant="outlined" startIcon={<DeleteIcon />}>Διαγραφή Μηνύματος</Button>
            </Grid>
            <Grid item xs>
                <Typography variant="button">{props.fromFolder == 'Inbox' ? `Από ${props.message.sender}`: `Πρός ${props.message.receiver}`}</Typography>
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
    const [receiverExists, setReceiverExists] = useState(true) // After proper API call, in case receiver is invalid, we must let the sender know. controls visibility of alert.
    // This can happen either after submit, or after leaving the receiver field (onBlur), an API call can be made in the background. 

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
        msg.read = true // This will later make a PATCH API call.
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