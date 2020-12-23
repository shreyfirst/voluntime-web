import { useState } from 'react';
import { Typography, TextField, Grid, Button, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline as EmailIcon, Phone as PhoneIcon, Instagram as InstagramIcon, Lock as LockIcon } from '@material-ui/icons';
import { TextFieldIcon } from '../../helpers';
import ChangePassword from './ChangePassword';

const useStyles = makeStyles({
    container: {
        width: '50%',
    },
    textField: {
        width: '100%',
        maxWidth: '32em'
    },
    button: {
        minWidth: '12em',
    }
});

const Account = props => {

    const [passwordOpen, setPasswordOpen] = useState(false);

    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Typography variant='body2'>
                View and edit your Voluntime account here.
            </Typography><br />
            <Typography variant='h6'>
                Profile
            </Typography><br />
            <TextField variant='outlined' label='First Name' required className={classes.textField} /><br /><br />
            <TextField variant='outlined' label='Last Name' required className={classes.textField} /><br /><br />
            <TextField variant='outlined' label='Age' type='number' inputProps={{ min: 1, max: 999 }} className={classes.textField} /><br /><br />
            <Typography variant='body1'>
                Contact Information (Public)
            </Typography><br />
            <TextFieldIcon variant='outlined' label='Public Email Address' icon={<EmailIcon />} type="email" className={classes.textField} /><br />
            <TextFieldIcon variant='outlined' label='Public Phone Number' icon={<PhoneIcon />} type="tel" className={classes.textField} /><br />
            <TextFieldIcon variant='outlined' label='Public Instagram Handle' icon={<InstagramIcon />} className={classes.textField} />

            <br />
            <Typography variant='h6'>
                Account
            </Typography><br />
            <TextField variant='outlined' label='Email Address' type="email" helperText='This is your private email address and will not be shown to other users.' required className={classes.textField} /><br /><br />
            Password:{' '}
            {
                props.user.method === 'normal' //CHANGE TO GOOGLE
                    ? 'Use Sign in with Google instead of a password.'
                    : <Button variant='outlined' onClick={() => setPasswordOpen(true)} startIcon={<LockIcon />}>Change Password</Button>
            }
            <br /><br />
            <Grid container justify="flex-end">
                <Button variant='contained' color='primary'>
                    Save Changes
                </Button>
            </Grid>

            <ChangePassword open={passwordOpen} setOpen={setPasswordOpen} />
        </div>
    );
};

export default Account;