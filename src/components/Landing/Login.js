import { useState } from 'react';
import { Grid, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { login } from '../../services';
import ForgotPassword from './ForgotPassword';

const useStyles = makeStyles({
    container: {
        height: '100%',
        position: 'relative',
        boxSizing: "border-box",
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
    forgotPassword: {
        textTransform: 'none',
    },
    toggle: {
        position: 'absolute',
        bottom: '5%',
    },
});

const Login = props => {

    const [view, setView] = useState('login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (email.length < 1) {
            setError('Please enter your email address to login.');
            return;
        }
        if (password.length < 1) {
            setError('Please enter your password to login.');
            return;
        }
        setLoading(true);
        login({ email, password }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                props.setUser(data);
                //move to dashboard with new user
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
        <>
            {
                view === 'forgotPassword'
                    ? <ForgotPassword setView={setView} />
                    : <div className={classes.container}>
                        <Typography variant="h4">
                            Login
                        </Typography>
                        <br />
                        <TextField onKeyDown={keyPress} onChange={event => setEmail(event.target.value)} type="email" label="Email Address" variant="outlined" fullWidth className={classes.textField} /><br />
                        <TextField onKeyDown={keyPress} onChange={event => setPassword(event.target.value)} type="password" label="Password" variant="outlined" fullWidth className={classes.textField} />
                        <Button onClick={handleSubmit} disabled={loading} variant="contained" color="primary" fullWidth className={classes.button}>
                            {
                                loading
                                    ? <CircularProgress size={24} color='secondary' />
                                    : 'LOGIN'
                            }
                        </Button>
                        <br />
                        {
                            error.length > 0 &&
                            <Alert severity="error">{error}</Alert>
                        }
                        <br />
                        <Button onClick={() => setView('forgotPassword')} variant="text" className={classes.forgotPassword}>Forgot Password?</Button>
                        <Grid container justify="center" className={classes.toggle}>
                            <Grid item>
                                Don't have an account? <Button variant="text" color="primary" onClick={() => props.setView('signup')}>Sign Up</Button>
                            </Grid>
                        </Grid>
                    </div>
            }
        </>

    );
};

export default Login;