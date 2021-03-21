import { useState } from 'react';
import { Card, Grid, Typography, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { PlaylistAdd as AddLogIcon, ListAlt as LogsIcon, Event as EventsIcon, Unarchive } from '@material-ui/icons';
import CircularProgressButton from '../../helpers/CircularProgressButton';
import { useHistory, Link } from 'react-router-dom';
import { unarchiveOrg } from '../../../services/orgs';

const useStyles = makeStyles(theme => ({
    container: props => ({
        width: '100%',
        height: '100%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
        cursor: props.archive ? 'initial' : 'pointer',
        '&:hover': {
            boxShadow: '0 4px 7px rgba(0,0,0,0.45)'
        },
        ...(props.archive && { paddingBottom: 10 })
    }),
    grid: {
        width: '100%',
        height: '100%'
    },
    imageOverlay: props => ({
        backgroundColor: props.archive
            ? '#9e9e9e'
            : props.role === 'owner'
                ? theme.palette.primary.main
                : props.role === 'admin'
                    ? theme.palette.secondary.main
                    : theme.palette.success.main,
        height: '50%',
    }),
    image: {
        height: '100%',
    },
    info: {
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingTop: '3%',
        position: 'relative',
        height: '50%'
    },
    name: {
        fontSize: '1.3em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'box',
        lineClamp: 1,
        boxOrient: 'vertical',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    nameLink: {
        color: '#000',
        textDecoration: 'none'
    },
    description: {
        color: '#636363',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'box',
        lineClamp: 3,
        boxOrient: 'vertical',
    },
    quickButtons: {
        position: 'absolute',
        bottom: 5,
    },
    quickButton: {
        fontSize: '30px',
        color: '#000',
        transition: 'color 0.18s',
        '&:hover': {
            color: theme.palette.secondary.main
        }
    },
    unarchiveButton: {
        width: '100%',
        marginTop: 15,
    },
}));

const OrgCard = props => {
    const history = useHistory();
    const classes = useStyles({ archive: props.archive, role: props.org.role });

    const [loading, setLoading] = useState(false); //for unarchive button
    const [error, setError] = useState('');

    const quickButtonClicked = (e, view) => {
        history.push({ pathname: `/dashboard/${props.org.id}`, state: { view } });
        e.stopPropagation();
    };

    const handleUnarchive = e => {
        setLoading(true);
        unarchiveOrg({
            token: props.user.token,
            id: props.org.id,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                let oldUser = props.user;
                oldUser.orgs[props.user.orgs.findIndex(o => o.id === props.org.id)] = data;
                props.setUser({ ...oldUser, orgs: [...oldUser.orgs] });
            }
        });
        e.stopPropagation();
    };

    return (
        <Card className={classes.container} onClick={() => !props.archive && history.push(`/dashboard/${props.org.id}`)}>
            <Grid container className={classes.grid}>
                <Grid container justify='center' alignItems='center' className={classes.imageOverlay}>
                    {
                        props.org.image?.length > 0 &&
                        <img src={props.org.image} className={classes.image} alt='' />
                    }
                </Grid>
                <Grid item xs={12} className={classes.info}>
                    <Typography className={classes.name}>
                        {
                            props.archive
                                ? props.org.name
                                : <Link to={`/dashboard/${props.org.id}`} onClick={e => e.stopPropagation()} className={classes.nameLink}>{props.org.name}</Link>
                        }

                    </Typography>
                    <Typography variant='body2' className={classes.description}>
                        {props.org.description}
                    </Typography>
                    {
                        props.archive
                            ? props.org.role === 'owner' &&
                            <>
                                <Button variant='outlined' onClick={e => handleUnarchive(e)} startIcon={loading ? <CircularProgressButton /> : <Unarchive />} className={classes.unarchiveButton}>
                                    Unarchive
                                </Button>
                                {
                                    error.length > 0 &&
                                    <Alert severity='error'>{error}</Alert>
                                }
                            </>
                            : <Grid container className={classes.quickButtons} justify='space-around'>
                                <AddLogIcon color='primary' onClick={e => quickButtonClicked(e, 'add')} classes={{ colorPrimary: classes.quickButton }} />
                                <LogsIcon color='primary' onClick={e => quickButtonClicked(e, 'hours')} classes={{ colorPrimary: classes.quickButton }} />
                                <EventsIcon color='primary' onClick={e => quickButtonClicked(e, 'events')} classes={{ colorPrimary: classes.quickButton }} />
                            </Grid>
                    }
                </Grid>
            </Grid>
        </Card>
    );
};

export default OrgCard;