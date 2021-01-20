import { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, IconButton, CircularProgress, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { changePassword } from '../../../services/users';

const useStyles = makeStyles({
    textField: {
        minWidth: '32em'
    },
    submitButton: {
        minWidth: '10em'
    }
});

const ChangePassword = props => {

    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const closeDialog = () => {
        setError('');
        setOldPassword('');
        setPassword('');
        setConfirm('');
        props.setOpen(false);
    };

    const handleSubmit = () => {
        setSuccess('');
        if (oldPassword.length < 1) {
            setError('You must provide your current password before changing it. If you forgot it, log out and press Forgot Password.');
            return;
        }
        if (password.length < 1) {
            setError('Please enter a new password.');
            return;
        }
        if (password.length < 5) {
            setError('Please enter a new password of at least 5 characters.');
            return;
        }
        if (confirm.length < 1) {
            setError('Please retype your new password in the Confirm Password box.');
            return;
        }
        if (password !== confirm) {
            setError('Confirm Password doesn\'t match.');
            return;
        }
        setLoading(true);
        changePassword({
            token: props.user.token,
            oldPassword,
            password,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                setSuccess('Your password has been changed.');
            }
        });
    };

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={closeDialog} fullWidth>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <TextField variant='outlined' type='password' label='Old Password' onChange={e => setOldPassword(e.target.value)} className={classes.textField} /><br /><br />
                <TextField variant='outlined' type={showPassword ? 'text' : 'password'} label='New Password' onChange={e => setPassword(e.target.value)} className={classes.textField}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='show password'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }} /><br /><br />
                <TextField variant='outlined' type={showConfirm ? 'text' : 'password'} label='Confirm New Password' onChange={e => setConfirm(e.target.value)} className={classes.textField}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='show confirm'
                                    onClick={() => setShowConfirm(!showConfirm)}
                                >
                                    {showConfirm ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }} />
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={closeDialog} color='primary'>
                    Cancel
                </Button>
                <Button variant='contained' onClick={handleSubmit} color='primary' disabled={loading} className={classes.submitButton}>
                    {
                        loading
                            ? <CircularProgress size={24} color='secondary' />
                            : 'Change Password'
                    }
                </Button>
            </DialogActions>
            {
                success.length > 0 &&
                <Alert severity='success'>{success} <Link component='button' onClick={closeDialog}>Done</Link></Alert>
            }
            {
                error.length > 0 &&
                <Alert severity='error'>{error}</Alert>
            }
        </Dialog>
    );
};

export default ChangePassword;