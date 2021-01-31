import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { RemoveCircleOutline as RemoveIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { removeMember } from '../../../services/orgs';
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
const ConfirmRemove = props => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const closeDialog = () => {
        setError('');
        props.setOpen(false);
    };

    const handleSubmit = () => {
        setLoading(true);
        removeMember({
            token: props.user.token,
            userId: props.member.id,
            orgId: props.org.id
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                props.setOpen(false);
                //remove from members
                var newMembers = [...props.members];
                newMembers[newMembers.findIndex(m => m.id === props.member.id)].roleActive = false;
                props.setMembers(newMembers);
            }
        });
    };

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={closeDialog} fullWidth>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to remove <strong>{props.member.firstName} {props.member.lastName}</strong>? They will need to be invited again to rejoin the organization. Their hour logs will not be lost.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={closeDialog} color='primary'>
                    Cancel
                </Button>
                <Button variant='outlined' onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgressButton /> : <RemoveIcon />} className={classes.submitButton}>
                    Remove Member
                </Button>
            </DialogActions>
            {
                error.length > 0 &&
                <Alert severity='error'>{error}</Alert>
            }
        </Dialog>
    );
};

export default ConfirmRemove;