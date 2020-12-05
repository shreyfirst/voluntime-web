import { useState } from 'react';
import { Typography, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { ArrowBack } from '@material-ui/icons';
import { resendVerifyEmail } from '../../services';

const useStyles = makeStyles({
    container: {
        height: '100%',
        position: 'relative',
        boxSizing: "border-box",
        paddingBottom: '12%',
    },
    fullWidth: {
        width: '100%',
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

const VerifyEmail = props => {
    const [resendLoading, setResendLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendError, setResendError] = useState('');
    const [verifyError, setVerifyError] = useState('');
    const [resendSuccess, setResendSuccess] = useState('');

    const backButtonClicked = () => {
        props.setView('signup');
    };

    const resendClicked = () => {
        setResendLoading(true);
        resendVerifyEmail(props.user.id, (err, data) => {
            setResendLoading(false);
            if (err) {
                setResendSuccess('');
                setResendError(data.message);
            } else {
                setResendError('');
                setResendSuccess('Email resent to ');
            }
        });
    };

    const verifyClicked = () => {
        setVerifyLoading(true);
    };

    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Button className={classes.backButton} variant='text' startIcon={<ArrowBack />} onClick={backButtonClicked}>Back</Button>
            <Typography variant="h4">
                Verify Email
            </Typography><br /><br />
            <Typography variant="body1">
                Your account has been created. A verification email has been sent to <strong>{props.user.email}</strong>.
                <br /><br />
                Please click the link in the email to verify that email address belongs to you.
            </Typography>
            <br /><br />
            <Button disabled={resendLoading} onClick={resendClicked} variant="contained" color="primary" fullWidth className={classes.button}>
                {
                    resendLoading
                        ? <CircularProgress size={24} color='secondary' />
                        : 'Resend Email'
                }
            </Button>
            <br />
            {
                resendSuccess.length > 0 &&
                <Alert severity="success">{resendSuccess}<strong>{props.user.email}</strong>.</Alert>
            }
            {
                resendError.length > 0 &&
                <Alert severity="error">{resendError}</Alert>
            }
            <Button disabled={verifyLoading} onClick={verifyClicked} variant="contained" color="primary" fullWidth className={classes.button}>
                {
                    verifyLoading
                        ? <CircularProgress size={24} color='secondary' />
                        : 'Email Verified'
                }
            </Button>
            <br />
            {
                verifyError.length > 0 &&
                <Alert severity="error">{verifyError}</Alert>
            }
        </div>
    );
};

export default VerifyEmail;