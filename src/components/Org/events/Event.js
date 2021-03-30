import { Card, CardContent, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Edit as EditIcon, LocationOn as LocationIcon, Event as TimeIcon, HourglassEmpty as HoursIcon } from '@material-ui/icons';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const useStyles = makeStyles({
    container: {
        paddingTop: 5,
        marginBottom: 10,
        boxShadow: '0 2px 2px rgba(0,0,0,0.25)',
        position: 'relative'
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
    editButtonContainer: {
        position: 'absolute',
        right: 5,
        bottom: 10
    }
});

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
                <IconAlign icon={<TimeIcon />}>
                    {start.format('ddd, MMM D, YYYY [at] hh:mm A')} &ndash;<br />
                    {end.format('ddd, MMM D, YYYY [at] hh:mm A')}
                </IconAlign><br />
                <IconAlign icon={<HoursIcon />}><strong>{event.hours}</strong> volunteer hour{event.hours !== 1 && 's'}</IconAlign>
                {
                    event.location.length > 0 &&
                    <><br /><IconAlign icon={<LocationIcon />}>{event.location}</IconAlign></>
                }
                {
                    event.description.length > 0 &&
                    <>
                        <br />
                        <ReactMarkdown plugins={[gfm]}
                            renderers={{ link: props => <a href={props.href} target='_blank' rel='noopener noreferrer'>{props.children}</a> }}
                            className={classes.description}>{event.description}</ReactMarkdown>
                    </>
                }
                {
                    props.role !== 'vol' &&
                    <span className={classes.editButtonContainer}>
                        <IconButton onClick={() => props.setEditEvent(event)}><EditIcon /></IconButton>
                    </span>
                }
            </CardContent>
        </Card>
    );
};

export default Event;