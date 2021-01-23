import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { RemoveCircleOutline as LeaveIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { leaveOrg } from '../../../services/orgs';
import { useHistory } from 'react-router-dom';
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
const LeaveConfirm = props => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const closeDialog = () => {
        setError('');
        props.setOpen(false);
    };

    const handleSubmit = () => {
        setLoading(true);
        leaveOrg({
            token: props.user.token,
            id: props.org.id,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                //remove from orgs and redirect to dashboard
                var newUser = props.user;
                newUser.orgs.splice(newUser.orgs.findIndex(o => o.id === props.org.id), 1);
                props.setUser(newUser);
                history.push('/dashboard');
            }
        });
    };

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={closeDialog} fullWidth>
            <DialogTitle>Leave Organization</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to leave <strong>{props.org.name}</strong>? You will need to be invited again to rejoin the organization. Your hour logs will not be lost.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={closeDialog} color='primary'>
                    Cancel
                </Button>
                <Button variant='outlined' onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgressButton /> : <LeaveIcon />} className={classes.submitButton}>
                    Leave Organization
                </Button>
            </DialogActions>
            {
                error.length > 0 &&
                <Alert severity='error'>{error}</Alert>
            }
        </Dialog>
    );
};

export default LeaveConfirm;