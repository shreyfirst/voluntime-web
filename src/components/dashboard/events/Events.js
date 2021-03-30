import { useState, useEffect } from 'react';
import { Grid, IconButton, CircularProgress, TextField, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Refresh as RefreshIcon, Search as SearchIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import Fetching from '../../helpers/Fetching';
import EventList from './EventList';
import EditEvent from './EditEvent';
import { getEventsUser } from '../../../services/events';

const useStyles = makeStyles({
    container: {
        position: 'relative'
    },
    refresh: {
        position: 'absolute',
        right: 0,
        top: 0
    },
    search: {
        width: '90%'
    },
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
        getEventsUser({
            token: props.user.token
        }, (err, data) => {
            if (err) {
                setError(data.message);
            } else {
                setError('');
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
            const search = searchValue.replace(/\s+/g, '').toLowerCase();
            setResults(props.events.filter(e => e.title.replace(/\s+/g, '').toLowerCase().includes(search) || e.org.name.replace(/\s+/g, '').toLowerCase().includes(search)));
        }
    };

    useEffect(handleSearch, [searchValue, props.events]);

    const classes = useStyles();
    return (
        view === 'edit'
            ? <EditEvent user={props.user} events={props.events} setEvents={props.setEvents} event={editEvent} goBack={() => setView('events')} />
            : <>
                <Grid container>
                    <Grid item xs={12} sm={9} md={7} lg={6} className={classes.container}>
                        <span className={classes.refresh}>
                            <IconButton onClick={handleRefresh} disabled={loadingRefresh}>
                                {loadingRefresh
                                    ? <CircularProgress size={32} color='secondary' />
                                    : <RefreshIcon className={classes.actionIcon} />}
                            </IconButton>
                        </span>
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
                                <EventList events={searchValue.length < 1 || results === null ? props.events : results} setEditEvent={event => { setView('edit'); setEditEvent(event); }} />
                                <br />
                            </>}
                    </Grid>
                </Grid>
            </>
    );
};

export default Events;