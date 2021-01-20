import { useState } from 'react';
import { Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { forgotPassword } from '../../services';
import { ArrowBack } from '@material-ui/icons';

const useStyles = makeStyles({
    container: {
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        paddingBottom: '12%',
    },
    textField: {
        marginTop: 10,
    },
    button: {
        marginTop: 20,
        paddingTop: 8,
        paddingBottom: 8,
    },
    backButton: {
        position: 'absolute',
        top: '-6%',
        left: '-3%'
    }
});

const ForgotPassword = props => {

    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const backButtonClicked = () => props.setView('signup');

    const handleSubmit = () => {
        if(email.length < 1) {
            setError('Please enter the email address of your Voluntime account.');
            return;
        }
        setLoading(true);
        forgotPassword(email, (err, data) => {
            setLoading(false);
            if (err) {
                setSuccess('');
                setError(data.message);
            } else {
                setError('');
                setSuccess('Email sent! Check your inbox to reset your password.');
            }
        });
    };

    const keyPress = event => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Button className={classes.backButton} variant='text' startIcon={<ArrowBack />} onClick={backButtonClicked}>Back</Button>

            <Typography variant='h4'>
                Forgot Password
            </Typography><br /><br />
            <Typography variant='body1'>
                Please enter your account's email address. An email will be sent to you with a link to reset your password.
            </Typography><br /><br />
            <TextField onKeyDown={keyPress} onChange={event => setEmail(event.target.value)} type='email' label='Email Address' variant='outlined' fullWidth className={classes.textField} />
            <Button onClick={handleSubmit} disabled={loading} variant='contained' color='primary' fullWidth className={classes.button}>
                {
                    loading
                        ? <CircularProgress size={24} color='secondary' />
                        : 'Send Email'
                }
            </Button>
            <br />
            {
                success.length > 0 &&
                <Alert severity='success'>{success}</Alert>
            }
            {
                error.length > 0 &&
                <Alert severity='error'>{error}</Alert>
            }
        </div>
    );
};

export default ForgotPassword;