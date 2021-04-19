import { useState, useEffect } from 'react';
import { Grid, Link, Typography, TextField, Button, Switch, InputAdornment, IconButton } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack, Add as AddIcon, Event as DateIcon } from '@material-ui/icons';
import CircularProgressButton from '../../helpers/CircularProgressButton';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import { createEvent } from '../../../services/events';
import DayjsUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const useStyles = makeStyles({
    switch: {
        marginTop: -1
    },
    descriptionPreview: {
        borderTop: '1px dotted black',
        borderBottom: '1px dotted black',
        borderRadius: 5,
        padding: 5,
    },
    description: {
        color: '#343434',
        '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#FBFBFB'
        },
        '& thead': {
            backgroundColor: '#e9ecef',
        },
        '& th': {
            padding: 20,
            wordWrap: 'break-word',
            border: '1px solid #dee2e6'
        },
        '& td': {
            padding: 20,
            wordWrap: 'break-word',
            border: '1px solid #dee2e6'
        }
    },
});

const CreateEvent = props => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [start, setStart] = useState(() => dayjs());
    const [end, setEnd] = useState(() => dayjs().add(1, 'hour'));
    const [hours, setHours] = useState(1);
    const [calcHours, setCalcHours] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = () => {
        if (title.length < 1) {
            setError('Please enter a title for your event.');
            return;
        }
        if (start.isAfter(end)) {
            setError('The start time must be before the end time.');
            return;
        }
        setLoading(true);
        createEvent({
            token: props.user.token,
            id: props.orgId,
            title,
            description,
            location,
            start: start.format('YYYY-MM-DDTHH:mm:ss'),
            end: end.format('YYYY-MM-DDTHH:mm:ss'),
            hours,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                setSuccess(true);
                let events = props.events;
                events.push(data);
                props.setEvents(events);
            }
        });
    };

    const goBack = () => {
        setSuccess(false);
        setError(false);
        props.goBack();
    };

    useEffect(() => {
        if (calcHours) {
            const h = Math.floor(end.diff(start, 'hour', true) * 100) / 100;
            setHours(h < 0 ? 0 : h);
        }
    }, [calcHours, start, end]);

    const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={11} sm={9} md={8} lg={5}>
                <Button variant='outlined' startIcon={<ArrowBack />} onClick={goBack}>Back</Button>
                <br /><br />
                <Typography variant='h6'>Create Event</Typography>
                <Typography variant='body2'>
                    Create an event to let members know about upcoming volunteer opportunities.
                </Typography><br />

                <TextField onChange={e => setTitle(e.target.value)} variant='outlined' label='Event Title' required fullWidth /><br /><br />

                <Grid container justify='flex-end'>
                    <a href='/markdown.html' target='_blank' rel='noopener noreferrer'>Markdown</a><br />
                </Grid>
                <TextField onChange={e => setDescription(e.target.value)} variant='outlined' label='Description' InputProps={{
                    placeholder: 'This textbox supports markdown! Try **bold** words.'
                }} inputProps={{ maxLength: 8000 }} multiline fullWidth rows={4} /><br /><br />
                {description.length > 0 &&
                    <>
                        Preview: <br />
                        <Typography component='div' className={classes.descriptionPreview}>
                            <ReactMarkdown plugins={[gfm]}
                                renderers={{ link: props => <a href={props.href} target='_blank' rel='noopener noreferrer'>{props.children}</a> }}
                                className={classes.description}>{description}</ReactMarkdown>
                        </Typography><br />
                    </>
                }

                <TextField onChange={e => setLocation(e.target.value)} variant='outlined' label='Location' fullWidth InputProps={{
                    placeholder: 'Where should volunteers go?'
                }} /><br /><br />

                <TextField type='number' onChange={e => {
                    if (e.target.value.toString().length <= 4) {
                        setCalcHours(false);
                        setHours(e.target.value);
                    }
                }} onBlur={() => {
                    if (hours.length < 1 || hours < 0) {
                        setHours(0);
                    }
                }} variant='outlined' label='Volunteer hours' InputProps={{
                    placeholder: '0'
                }} inputProps={{ min: 0, max: 9999 }} value={hours} fullWidth /><br />

                Auto-calculate hours: <Switch
                    checked={calcHours}
                    onChange={() => setCalcHours(!calcHours)}
                    color='primary'
                    className={classes.switch} /><br /><br />

                <MuiPickersUtilsProvider utils={DayjsUtils}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={10} md={9} xl={6}>
                            <DateTimePicker
                                format='MMM D, YYYY [at] h:mm A'
                                margin='normal'
                                label='Start time'
                                value={start}
                                onChange={setStart}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton>
                                                <DateIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={10} md={9} xl={6}>
                            <DateTimePicker
                                format='MMM D, YYYY [at] h:mm A'
                                margin='normal'
                                label='End time'
                                value={end}
                                onChange={setEnd}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton>
                                                <DateIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    readOnly: true
                                }}
                                minDate={start}
                            />
                        </Grid>
                    </Grid>
                </MuiPickersUtilsProvider><br />

                <Button variant='contained' color='primary' disabled={loading || success} onClick={handleSubmit} startIcon={loading ? <CircularProgressButton /> : <AddIcon />}>
                    Create Event
                </Button>
                <br />
                {
                    error.length > 0 &&
                    <Alert severity='error'>{error}</Alert>
                }
                {
                    success &&
                    <Alert severity='success'>Success! The event has been created. <Link component='button' onClick={goBack}><Typography variant='body2'>View all events</Typography></Link></Alert>
                }
            </Grid>
        </Grid>
    );
};

export default CreateEvent;