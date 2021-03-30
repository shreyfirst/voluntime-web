import Event from './Event';

const EventList = props => {
    return (
        <>
            {
                props.events.length === 0
                    ? 'No Results'
                    : props.events.map(e => <Event key={e.id} event={e} role={props.role} setEditEvent={props.setEditEvent} />)
            }
        </>
    );
};

export default EventList;