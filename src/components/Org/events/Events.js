import { useState } from 'react';
import { Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import CreateEvent from './CreateEvent';

const Events = props => {
    const [create, setCreate] = useState(false);
    return (
        create
            ? <CreateEvent user={props.user} org={props.org} events={props.events} setEvents={props.setEvents} goBack={() => setCreate(false)} />
            :
            <>
                Events<br /><br />
                {
                    props.org.role !== 'vol' &&
                    <Button variant='outlined' startIcon={<AddIcon />} onClick={() => setCreate(true)}>Create Event</Button>
                }


            </>
    );
};

export default Events;