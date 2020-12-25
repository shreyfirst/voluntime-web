import { useState } from 'react';
import { Grid, Typography, TextField, Button, CircularProgress, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { login } from '../../services';
import { loginGoogle } from '../../services';
import ForgotPassword from './ForgotPassword';
import { useHistory } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import GoogleIcon from '../helpers/GoogleIcon';

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
    googleLogin: {
        textTransform: 'none',
        backgroundColor: '#FFF',
        minWidth: '50%'
    },
});

const Login = props => {

    const history = useHistory();

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
                history.push(props.from === undefined ? '/dashboard' : props.from);
            }
        });
    };

    const keyPress = event => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const responseGoogle = response => {
        if (response.error === undefined) {
            setLoading(true);
            loginGoogle(response.tokenObj.id_token, (err, data) => {
                setLoading(false);
                if (err) {
                    setError(data.message);
                } else {
                    setError('');
                    props.setUser(data);
                    history.push(props.from === undefined ? '/dashboard' : props.from);
                }
            });
        } else {
            if (response.error === 'idpiframe_initialization_failed') {
                setError('Cookies must be enabled to use Sign in with Google.');
            } else {
                setError('Sign in with Google failed. Please try again.');
            }
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
                            <Alert severity="error">{error} {error.startsWith('There\'s no account with that email address') && <>{' '}<Link component="button" onClick={() => props.setView('signup')}>Create Account</Link></>}</Alert>
                        }
                        <br />
                        <Button onClick={() => setView('forgotPassword')} variant="text" className={classes.forgotPassword}>Forgot Password?</Button>
                        <br /><br />
                        <GoogleLogin
                            clientId="978484937841-gg9qpc12jq2ccdom9mqv5mjbibfgu886.apps.googleusercontent.com"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy='single_host_origin'
                            render={renderProps => (
                                <Button startIcon={<GoogleIcon />} className={classes.googleLogin} onClick={renderProps.onClick} disabled={renderProps.disabled} variant='contained' autoCapitalize='false'>Sign in with Google</Button>
                            )}
                        />
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