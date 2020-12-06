import { useState, memo } from 'react';
import { Container, Typography, Paper, Grid, TextField, InputAdornment, IconButton, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../../services';

const useStyles = makeStyles({
    container: {
        minHeight: '100vh',
        paddingTop: '4vh',
        paddingBottom: '4vh',
        boxSizing: "border-box",
        backgroundColor: '#f7f7f7',
    },
    gridContainer: {
        width: '100%'
    },
    paper: {
        width: 960,
        maxWidth: 960,
        paddingLeft: '3%',
        paddingRight: '3%',
        paddingTop: '2%',
        paddingBottom: '3%',
    },
    bold: {
        fontWeight: 'bold'
    },
    textField: {
        minWidth: 400,
        width: '60%',
    },
    button: {
        minWidth: 400,
        width: '60%',
        marginTop: 20,
        paddingTop: 8,
        paddingBottom: 8,
    },
    alert: {
        minWidth: 400,
        width: '60%',
        boxSizing: 'border-box'
    },
});

const ResetPassword = props => {

    const { id } = useParams();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const resetPasswordClicked = () => {
        if (password !== confirmPassword) {
            setSuccess('');
            setError('Confirm password doesn\'t match! Please make sure that both passwords are the same.');
            return;
        }
        if(id === undefined || id === null || id.length < 1) {
            setSuccess('');
            setError('Invalid URL! Make sure the URL is the same as what you recieved in your email and try again.');
            return;
        }
        setLoading(true);
        resetPassword({
            id,
            newPassword: password,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setSuccess('');
                setError(data.message);
            } else {
                setError('');
                setSuccess('Your password has been reset!');
            }
        });
    };

    const classes = useStyles();
    return (
        <Container maxWidth={false} className={classes.container}>
            <Grid container justify="center" className={classes.gridContainer}>
                <Grid item>
                    <Typography variant="h3" className={classes.bold}>
                        Voluntime
                    </Typography><br /><br />
                </Grid>
                <Grid container item xs={12} justify="center">
                    <Paper className={classes.paper}>
                        <Typography variant="h5">
                            Reset Password
                        </Typography><br />
                        <Typography variant="body1">
                            Please fill out the textboxes below to reset the password to your Voluntime account.<br />
                            If you don't want to reset your password, you may simply exit this page.
                        </Typography><br /><br />
                        <TextField onChange={event => setPassword(event.target.value)} type={showPassword ? "text" : "password"} label="New Password" variant="outlined" fullWidth className={classes.textField}
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
                        <TextField onChange={event => setConfirmPassword(event.target.value)} type={showConfirmPassword ? "text" : "password"} label="Confirm Password" variant="outlined" fullWidth className={classes.textField}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="show password"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }} />
                        <Button disabled={loading} onClick={resetPasswordClicked} variant="contained" color="primary" className={classes.button}>
                            {
                                loading
                                    ? <CircularProgress size={24} color='secondary' />
                                    : 'Reset Password'
                            }
                        </Button>
                        <br />
                        {
                            success.length > 0 &&
                            <Alert severity="success" className={classes.alert}>{success}</Alert>
                        }
                        {
                            error.length > 0 &&
                            <Alert severity="error" className={classes.alert}>{error}</Alert>
                        }
                    </Paper>
                </Grid>
            </Grid>

        </Container>
    );
};

export default memo(ResetPassword);