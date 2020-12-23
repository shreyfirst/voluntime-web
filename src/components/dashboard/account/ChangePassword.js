import { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const useStyles = makeStyles({
    textField: {
        minWidth: '32em'
    }
});

const ChangePassword = props => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const closeDialog = () => props.setOpen(false);

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={closeDialog}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <TextField variant='outlined' type='password' label='Old Password' className={classes.textField} /><br /><br />
                <TextField variant='outlined' type={showPassword ? 'text' : 'password'} label='New Password' className={classes.textField}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="show password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }} /><br /><br />
                <TextField variant='outlined' type={showConfirm ? 'text' : 'password'} label='Confirm New Password' className={classes.textField}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="show confirm"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                >
                                    {showConfirm ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }} />
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={closeDialog} color="primary">
                    Cancel
                </Button>
                <Button variant='contained' onClick={closeDialog} color="primary">
                    Change Password
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePassword;