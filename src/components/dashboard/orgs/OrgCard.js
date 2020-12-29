
import { Card, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PlaylistAdd as AddLogIcon, ListAlt as LogsIcon, Event as EventsIcon } from '@material-ui/icons';
import { useHistory, Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: '100%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0 4px 7px rgba(0,0,0,0.45)',
            '& $name': {
                textDecoration: 'underline'
            }
        }
    },
    grid: {
        width: '100%',
        height: '100%'
    },
    image: props => ({
        backgroundColor: props.role === 'owner'
            ? theme.palette.primary.main
            : props.role === 'admin'
                ? theme.palette.secondary.main
                : theme.palette.success.main,
        height: '50%',
    }),
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
}));

const OrgCard = props => {
    const history = useHistory();
    const classes = useStyles({ role: props.org.role });

    const quickButtonClicked = (e, view) => {
        history.push({ pathname: `/dashboard/${props.org.id}`, state: { view } });
        e.stopPropagation();
    };

    return (
        <Card className={classes.container} onClick={() => history.push(`/dashboard/${props.org.id}`)}>
            <Grid container className={classes.grid}>
                <Grid item xs={12} className={classes.image} />
                <Grid item xs={12} className={classes.info}>
                    <Typography className={classes.name}>
                        <Link to={`/dashboard/${props.org.id}`} onClick={e => e.stopPropagation()} className={classes.nameLink}>{props.org.name}</Link>
                    </Typography>
                    <Typography variant="body2" className={classes.description}>
                        {props.org.description}
                    </Typography>
                    <Grid container className={classes.quickButtons} justify='space-around'>
                        <AddLogIcon color='primary' onClick={e => quickButtonClicked(e, 'add')} classes={{ colorPrimary: classes.quickButton }} />
                        <LogsIcon color='primary' onClick={e => quickButtonClicked(e, 'hours')} classes={{ colorPrimary: classes.quickButton }} />
                        <EventsIcon color='primary' onClick={e => quickButtonClicked(e, 'events')} classes={{ colorPrimary: classes.quickButton }} />
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};

export default OrgCard;