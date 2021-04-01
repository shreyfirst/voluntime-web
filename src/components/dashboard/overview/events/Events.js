import { useEffect, useState } from 'react';
import Event from './Event';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';

const now = dayjs();

const useStyles = makeStyles({
    container: {
        display: 'flex',
        overflowX: 'auto'
    }
});

const Events = props => {

    const [upcoming, setUpcoming] = useState(null);

    useEffect(() => {
        let u = [];
        for (let i = props.events.length-1; i >= 0; --i) {
            if (dayjs(props.events[i].start).isAfter(now)) {
                u.push(...props.events.slice(0, i+1).reverse());
                break;
            }
        }

        if(u.length === 0) { //if no future events, use past events
            props.setUpcoming(false);
            u.push(...props.events.slice(0, 5));
        }

        setUpcoming(u);
    }, [props.events]);

    const classes = useStyles();
    return (
        <div className={classes.container}>
            {
                upcoming !== null &&
                upcoming.map(e => <Event key={e.id} event={e} />)
            }
        </div>
    );
};

export default Events;