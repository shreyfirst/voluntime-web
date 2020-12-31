import { useState } from 'react';
import { Typography, TextField, Grid, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline as EmailIcon, Phone as PhoneIcon, Instagram as InstagramIcon, Lock as LockIcon } from '@material-ui/icons';
import TextFieldIcon from '../../helpers/TextFieldIcon';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import { editProfile } from '../../../services/users';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    container: {
        width: '100%',
    },
    textField: {
        width: '100%',
    },
    submitButton: {
        minWidth: '10em',
    },
    helperText: {
        color: '#414141'
    }
});

const Account = props => {

    const history = useHistory();

    const [firstName, setFirstName] = useState(props.user.firstName);
    const [lastName, setLastName] = useState(props.user.lastName);
    const [note, setNote] = useState(props.user.note);

    const [contactEmail, setContactEmail] = useState(props.user.contactInfo.email);
    const [contactPhone, setContactPhone] = useState(props.user.contactInfo.phone);
    const [contactInstagram, setContactInstagram] = useState(props.user.contactInfo.instagram);

    const [emailOpen, setEmailOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = () => {
        setSuccess('');
        if (firstName.length < 1) {
            setError('Please enter your first name.');
            return;
        }
        if (lastName.length < 1) {
            setError('Please enter your last name.');
            return;
        }

        setLoading(true);
        editProfile({
            token: props.user.token,
            firstName,
            lastName,
            note,
            contactInfo: {
                email: contactEmail,
                phone: contactPhone,
                instagram: contactInstagram
            },
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                setSuccess('Your changes have been saved.');
                props.setUser({ ...data, orgs: props.user.orgs });
            }
        });
    };

    const logout = () => {
        localStorage.removeItem('user');
        history.push('/');
    };

    const classes = useStyles();
    return (
        <Grid container className={classes.container}>
            <Grid item xs={9} sm={8} md={6} lg={5}>
                View and edit your Voluntime account here.
                <br /><br />
                <Typography variant='h6'>
                    Profile
                </Typography><br />
                <TextField variant='outlined' label='First Name' required onChange={e => setFirstName(e.target.value)} defaultValue={props.user.firstName} className={classes.textField} /><br /><br />
                <TextField variant='outlined' label='Last Name' required onChange={e => setLastName(e.target.value)} defaultValue={props.user.lastName} className={classes.textField} /><br /><br />
                <TextField variant='outlined' label='Note (additional info, public)' multiline rows={4} onChange={e => setNote(e.target.value)} defaultValue={props.user.note} className={classes.textField} /><br /><br />
                <Typography variant='body1'>
                    Contact Information (Optional)
                </Typography><br />
                <TextFieldIcon variant='outlined' label='Public Email Address' icon={<EmailIcon />} type="email" onChange={e => setContactEmail(e.target.value)} defaultValue={props.user.contactInfo.email} className={classes.textField} /><br />
                <TextFieldIcon variant='outlined' label='Public Phone Number' icon={<PhoneIcon />} type="tel" onChange={e => setContactPhone(e.target.value)} defaultValue={props.user.contactInfo.phone} className={classes.textField} /><br />
                <TextFieldIcon variant='outlined' label='Public Instagram Handle' icon={<InstagramIcon />} onChange={e => setContactInstagram(e.target.value)} defaultValue={props.user.contactInfo.instagram} className={classes.textField} />
                <br />
                <Grid container justify="flex-end">
                    <Button variant='contained' color='primary' onClick={handleSubmit} className={classes.submitButton}>
                        {
                            loading
                                ? <CircularProgress size={24} color='secondary' />
                                : 'Save Changes'
                        }
                    </Button>
                </Grid>
                {
                    success.length > 0 &&
                    <Alert severity="success">{success}</Alert>
                }
                {
                    error.length > 0 &&
                    <Alert severity="error">{error}</Alert>
                }

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
                <br /><br /><br />
                <Grid container justify='center'>
                    <Button variant='outlined' onClick={logout}>Log Out</Button>
                </Grid>
                <ChangeEmail open={emailOpen} setOpen={setEmailOpen} user={props.user} setUser={props.setUser} />
                <ChangePassword open={passwordOpen} setOpen={setPasswordOpen} user={{ token: props.user.token }} setUser={props.setUser} />
            </Grid>
        </Grid>
    );
};

export default Account;