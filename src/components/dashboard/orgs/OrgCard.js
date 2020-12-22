
import { Card, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PlaylistAdd as AddLogIcon, ListAlt as LogsIcon, Event as EventsIcon } from '@material-ui/icons';

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
    image: {
        backgroundColor: theme.palette.primary.main,
        height: '50%',
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
        boxOrient: 'vertical'
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
        transition: 'color 0.15s',
        '&:hover': {
            color: theme.palette.secondary.main
        }
    },
}));

const OrgCard = props => {
    const classes = useStyles();
    return (
        <Card className={classes.container}>
            <Grid container className={classes.grid}>
                <Grid item xs={12} className={classes.image} />
                <Grid item xs={12} className={classes.info}>
                    <Typography className={classes.name}>
                        {props.org.name}
                    </Typography>
                    <Typography variant="body2" className={classes.description}>
                        {props.org.description}
                    </Typography>
                    <Grid container className={classes.quickButtons} justify='space-around'>
                        <AddLogIcon color='primary' classes={{ colorPrimary: classes.quickButton }} />
                        <LogsIcon color='primary' classes={{ colorPrimary: classes.quickButton }} />
                        <EventsIcon color='primary' classes={{ colorPrimary: classes.quickButton }} />
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};

export default OrgCard;