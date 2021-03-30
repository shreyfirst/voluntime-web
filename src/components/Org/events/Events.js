import { useState, useEffect } from 'react';
import { Grid, IconButton, Button, CircularProgress, TextField, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import Fetching from '../../helpers/Fetching';
import EventList from './EventList';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import { getEventsOrg } from '../../../services/events';

const useStyles = makeStyles({
    container: {
        position: 'relative'
    },
    refresh: props => ({
        position: 'absolute',
        right: 0,
        top: props.role === 'vol' ? 0 : -6,
    }),
    search: props => ({
        width: props.role === 'vol' ? '90%' : '100%'
    }),
    actionIcon: {
        fontSize: 32,
    },
});

const Events = props => {
    const [view, setView] = useState('events');
    const [editEvent, setEditEvent] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [error, setError] = useState('');
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [results, setResults] = useState(null);

    const refresh = () => {
        getEventsOrg({
            token: props.user.token,
            id: props.org.id
        }, (err, data) => {
            if (err) {
                setError(data.message);
            } else {
                setError('');
                data = data.sort((a, b) => b.start.localeCompare(a.start));
                props.setEvents(data);
                setLoadingRefresh(false);
            }
        });
    };

    useEffect(() => {
        if (props.events === null) {
            refresh();
        }
    }, []);

    const handleRefresh = () => {
        setLoadingRefresh(true);
        refresh();
    };

    const handleSearch = () => {
        if (searchValue.length > 0) {
            setResults(props.events.filter(e => e.title.replace(/\s+/g, '').toLowerCase().includes(searchValue.replace(/\s+/g, '').toLowerCase())));
        }
    };

    useEffect(handleSearch, [searchValue, props.events]);

    const classes = useStyles({ role: props.org.role });
    switch (view) {
        case 'create': return <CreateEvent user={props.user} org={props.org} events={props.events} setEvents={props.setEvents} goBack={() => setView('events')} />;
        case 'edit': return <EditEvent user={props.user} org={props.org} events={props.events} setEvents={props.setEvents} event={editEvent} goBack={() => setView('events')} />;
        case 'events': return (
            <>
                <Grid container>
                    <Grid item xs={12} sm={9} md={7} lg={6} className={classes.container}>
                        {
                            props.org.role !== 'vol' &&
                            <Button variant='outlined' startIcon={<AddIcon />} onClick={() => setView('create')}>Create Event</Button>
                        }
                        <span className={classes.refresh}>
                            <IconButton onClick={handleRefresh} disabled={loadingRefresh}>
                                {loadingRefresh
                                    ? <CircularProgress size={32} color='secondary' />
                                    : <RefreshIcon className={classes.actionIcon} />}
                            </IconButton>
                        </span>
                        {
                            props.org.role !== 'vol' &&
                            <><br /><br /></>
                        }
                        <TextField onChange={e => setSearchValue(e.target.value)} variant='outlined' fullWidth className={classes.search} InputProps={{
                            placeholder: 'Search Events...', endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label='search'
                                        onClick={handleSearch}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }} />
                        <br /><br />
                        {
                            error.length > 0 &&
                            <>
                                <Alert severity='error'>{error}</Alert>
                                <br />
                            </>
                        }
                        {props.events === null
                            ? <Fetching />
                            : <>
                                <EventList events={searchValue.length < 1 || results === null ? props.events : results} setEditEvent={event => { setView('edit'); setEditEvent(event); }} role={props.org.role} />
                                <br />
                            </>}
                    </Grid>
                </Grid>
            </>
        );
    }
};

export default Events;