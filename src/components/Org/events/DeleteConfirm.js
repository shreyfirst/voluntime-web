import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { DeleteForever as DeleteIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { deleteEvent } from '../../../services/events';
import CircularProgressButton from '../../helpers/CircularProgressButton';

const useStyles = makeStyles({
    submitButton: {
        color: '#d73a49',
        borderColor: '#d73a49',
        '&:hover': {
            color: '#FFF',
            backgroundColor: '#d73a49',
        }
    }
});
const DeleteConfirm = props => {

    const event = props.event;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const closeDialog = () => {
        setError('');
        props.setOpen(false);
    };

    const handleSubmit = () => {
        setLoading(true);
        deleteEvent({
            token: props.user.token,
            id: event.id,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                //remove from events and go back
                let newEvents = props.events;
                newEvents.splice(newEvents.findIndex(e => e.id === event.id), 1);
                props.setEvents(newEvents);
                props.goBack();
            }
        });
    };

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={closeDialog} fullWidth>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete <strong>{event.title}</strong>? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={closeDialog} color='primary'>
                    Cancel
                </Button>
                <Button variant='outlined' onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgressButton /> : <DeleteIcon />} className={classes.submitButton}>
                    Delete Event
                </Button>
            </DialogActions>
            {
                error.length > 0 &&
                <Alert severity='error'>{error}</Alert>
            }
        </Dialog>
    );
};

export default DeleteConfirm;