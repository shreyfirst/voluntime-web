import { useState, useEffect } from 'react';
import { Grid, Link, Typography, TextField, Button, Switch, InputAdornment, IconButton } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack, Save as SaveIcon, Event as DateIcon } from '@material-ui/icons';
import CircularProgressButton from '../../helpers/CircularProgressButton';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import { editEvent } from '../../../services/events';
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

const EditEvent = props => {
    const event = props.event;

    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description);
    const [location, setLocation] = useState(event.location);
    const [start, setStart] = useState(() => dayjs(event.start));
    const [end, setEnd] = useState(() => dayjs(event.end));
    const [hours, setHours] = useState(event.hours);
    const [calcHours, setCalcHours] = useState(false);

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
        editEvent({
            token: props.user.token,
            id: event.id,
            orgId: props.org.id,
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
                let events = [...props.events];
                events[events.findIndex(e => e.id === event.id)] = data;
                props.setEvents(events);
            }
        });
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
                <Button variant='outlined' startIcon={<ArrowBack />} onClick={props.goBack}>Back</Button>
                <br /><br />
                <Typography variant='h6'>Edit Event: <strong>{event.title}</strong></Typography><br />

                <TextField onChange={e => setTitle(e.target.value)} variant='outlined' label='Event Title' defaultValue={event.title} required fullWidth /><br /><br />

                <Grid container justify='flex-end'>
                    <a href='/markdown.html' target='_blank' rel='noopener noreferrer'>Markdown</a><br />
                </Grid>
                <TextField onChange={e => setDescription(e.target.value)} variant='outlined' label='Description' defaultValue={event.description} InputProps={{
                    placeholder: 'This textbox supports markdown! Try **bold** words.'
                }} multiline fullWidth rows={4} /><br /><br />
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

                <TextField onChange={e => setLocation(e.target.value)} variant='outlined' label='Location' fullWidth defaultValue={event.location} InputProps={{
                    placeholder: 'Where should volunteers go?'
                }} /><br /><br />

                <TextField type='number' onChange={e => {
                    setCalcHours(false);
                    setHours(e.target.value)
                }} onBlur={() => {
                    if (hours.length < 1 || hours < 0) {
                        setHours(0);
                    }
                }} variant='outlined' label='Volunteer hours' defaultValue={event.hours} InputProps={{
                    placeholder: '0'
                }} inputProps={{ min: 0 }} value={hours} fullWidth /><br />

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
                                defaultValue={event.start}
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
                                defaultValue={event.start}
                            />
                        </Grid>
                    </Grid>
                </MuiPickersUtilsProvider><br />

                <Button variant='contained' color='primary' disabled={loading || success} onClick={handleSubmit} startIcon={loading ? <CircularProgressButton /> : <SaveIcon />}>
                    Save Changes
                </Button>
                <br />
                {
                    error.length > 0 &&
                    <Alert severity='error'>{error}</Alert>
                }
                {
                    success &&
                    <Alert severity='success'>Success! The event has been edited. <Link component='button' onClick={props.goBack}><Typography variant='body2'>View all events</Typography></Link></Alert>
                }
            </Grid>
        </Grid>
    );
};

export default EditEvent;