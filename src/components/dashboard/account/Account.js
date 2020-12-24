import { useState } from 'react';
import { Typography, TextField, Grid, Button, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline as EmailIcon, Phone as PhoneIcon, Instagram as InstagramIcon, Lock as LockIcon } from '@material-ui/icons';
import TextFieldIcon from '../../helpers/TextFieldIcon';
import ChangeEmail from './ChangeEmail';
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
    },
    helperText: {
        color: '#414141'
    }
});

const Account = props => {

    const [emailOpen, setEmailOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    const classes = useStyles();
    return (
        <div className={classes.container}>
            View and edit your Voluntime account here.
            <br /><br />
            <Typography variant='h6'>
                Profile
            </Typography><br />
            <TextField variant='outlined' label='First Name' required className={classes.textField} /><br /><br />
            <TextField variant='outlined' label='Last Name' required className={classes.textField} /><br /><br />
            <TextField variant='outlined' label='Age' type='number' inputProps={{ min: 1, max: 999 }} className={classes.textField} /><br /><br />
            <Typography variant='body1'>
                Contact Information (Optional)
            </Typography><br />
            <TextFieldIcon variant='outlined' label='Public Email Address' icon={<EmailIcon />} type="email" className={classes.textField} /><br />
            <TextFieldIcon variant='outlined' label='Public Phone Number' icon={<PhoneIcon />} type="tel" className={classes.textField} /><br />
            <TextFieldIcon variant='outlined' label='Public Instagram Handle' icon={<InstagramIcon />} className={classes.textField} />

            <br />
            <Typography variant='h6'>
                Account
            </Typography>
            <Typography variant='body2' className={classes.helperText}>
                This is private information and will not be shown to other users.
            </Typography><br />
            Email Address:{' '}
            <Button variant='outlined' onClick={() => setEmailOpen(true)} startIcon={<EmailIcon />}>Change Email</Button>
            <br /><br /><br />
            Password:{' '}
            {
                props.user.method === 'google' //CHANGE TO GOOGLE
                    ? 'Use Sign in with Google instead of a password.'
                    : <Button variant='outlined' onClick={() => setPasswordOpen(true)} startIcon={<LockIcon />}>Change Password</Button>
            }
            <br /><br />
            <Grid container justify="flex-end">
                <Button variant='contained' color='primary'>
                    Save Changes
                </Button>
            </Grid>

            <ChangeEmail open={emailOpen} setOpen={setEmailOpen} user={props.user} />
            <ChangePassword open={passwordOpen} setOpen={setPasswordOpen} />
        </div>
    );
};

export default Account;