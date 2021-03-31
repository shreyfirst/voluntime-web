import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Group as OrgIcon, LocationOn as LocationIcon, Event as TimeIcon, HourglassEmpty as HoursIcon } from '@material-ui/icons';
import dayjs from 'dayjs';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: 5,
        marginBottom: 10,
        boxShadow: '0 2px 2px rgba(0,0,0,0.25)',
        position: 'relative',
        display: 'inline-block',
        width: '50%',
        minWidth: 450,
        marginRight: 20
    },
    contact: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    contactValue: {
        color: '#343434',
        marginLeft: 15,
    },
    owner: {
        color: theme.palette.primary.main
    },
    admin: {
        color: theme.palette.secondary.main
    },
    vol: {
        color: theme.palette.success.main
    },
}));

const IconAlign = props => {
    const classes = useStyles();
    return (
        <div className={classes.contact}>
            {props.icon}
            <span className={classes.contactValue}><Typography className={classes.lightText}>{props.children}</Typography></span>
        </div>
    )
};


const Event = props => {
    const event = props.event;

    const start = dayjs(event.start);
    const end = dayjs(event.end);

    const classes = useStyles();
    return (
        <Card className={classes.container}>
            <CardContent>
                <Typography variant='h5'>
                    {event.title}
                </Typography><br />
                <IconAlign icon={<OrgIcon className={classes[event.org.role]} />}>{event.org.name}</IconAlign><br />
                <IconAlign icon={<TimeIcon />}>
                    {start.format('ddd, MMM D, YYYY [at] hh:mm A')} &ndash;<br />
                    {end.format('ddd, MMM D, YYYY [at] hh:mm A')}
                </IconAlign><br />
                <IconAlign icon={<HoursIcon />}><strong>{event.hours}</strong> volunteer hour{event.hours !== 1 && 's'}</IconAlign>
                {
                    event.location.length > 0 &&
                    <><br /><IconAlign icon={<LocationIcon />}>{event.location}</IconAlign></>
                }
            </CardContent>
        </Card>
    );
};

export default Event;