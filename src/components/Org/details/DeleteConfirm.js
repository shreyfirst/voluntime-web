import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { deleteOrg } from '../../../services/orgs';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    submitButton: {
        minWidth: '13em',
        color: '#d73a49',
        borderColor: '#d73a49',
        '&:hover': {
            color: '#FFF',
            backgroundColor: '#d73a49',
        }
    }
});
const DeleteConfirm = props => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const closeDialog = () => {
        setError('');
        props.setOpen(false);
    };

    const handleSubmit = () => {
        setLoading(true);
        deleteOrg({
            token: props.user.token,
            id: props.org.id,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                console.error(data.message);
            } else {
                var oldUser = props.user;
                oldUser.orgs[props.user.orgs.findIndex(o => o.id === props.org.id)] = data;
                props.setUser({ ...oldUser, orgs: [...oldUser.orgs] });
                history.push('/dashboard');
            }
        });
    };

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={closeDialog} fullWidth>
            <DialogTitle>Archive Organization</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to archive <strong>{props.org.name}</strong>? Members will not lose their hour logs but they won't be able to log new hours. You can unarchive this organization anytime via the Dashboard.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={closeDialog} color="primary">
                    Cancel
                </Button>
                <Button variant='outlined' onClick={handleSubmit} disabled={loading} className={classes.submitButton}>
                    {
                        loading
                            ? <CircularProgress size={24} color='secondary' />
                            : 'Archive Organization'
                    }
                </Button>
            </DialogActions>
            {
                error.length > 0 &&
                <Alert severity="error">{error}</Alert>
            }
        </Dialog>
    );
};

export default DeleteConfirm;