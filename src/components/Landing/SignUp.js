import { useState } from 'react';
import { Grid, Typography, TextField, Button, InputAdornment, IconButton } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff, /*Apple as AppleIcon*/ } from '@material-ui/icons';
import { createUser, createUserGoogle } from '../../services';
import { useHistory } from 'react-router-dom';
import VerifyEmail from './VerifyEmail';
import GoogleLogin from 'react-google-login';
import GoogleIcon from '../helpers/GoogleIcon';
import CircularProgressButton from '../helpers/CircularProgressButton';
//import AppleLogin from 'react-apple-login';

const useStyles = makeStyles({
    container: {
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        paddingBottom: '12%',
    },
    fullWidth: {
        width: '100%',
    },
    textField: {
        marginTop: 10,
    },
    button: {
        marginTop: 20,
        paddingTop: 8,
        paddingBottom: 8,
    },
    toggle: {
        position: 'absolute',
        bottom: '5%',
    },
    googleLogin: {
        textTransform: 'none',
        backgroundColor: '#FFF',
        minWidth: '50%',
        '&:hover': {
            backgroundColor: '#EFEFEF'
        }
    },
    /*appleLogin: {
        textTransform: 'none',
        backgroundColor: '#000',
        color: '#FFF',
        minWidth: '50%',
        '&:hover': {
            backgroundColor: '#000'
        }
    }*/
});

const SignUp = props => {

    const history = useHistory();

    const [view, setView] = useState('signup');

    const [showPassword, setShowPassword] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (firstName.length < 1 || lastName.length < 1) {
            setError('Please enter your first and last name.');
            return;
        }
        if (email.length < 1 || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 5) {
            setError('Please enter a password of at least 5 characters.');
            return;
        }
        setLoading(true);
        createUser({
            firstName,
            lastName,
            email,
            password
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                props.setUser(data);
                setView('verify');
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
            createUserGoogle(response.tokenObj.id_token, (err, data) => {
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
                setError('Cookies must be enabled to use Sign up with Google.');
            } else {
                setError('Sign in with Google failed. Please try again.');
            }
        }
    };

    const classes = useStyles();
    return (
        <>
            {
                view === 'verify'
                    ? <VerifyEmail user={{ ...props.user, password }} setUser={props.setUser} setView={setView} />
                    : <div className={classes.container}>
                        <Typography variant='h4'>
                            Sign Up
                        </Typography>
                        <Typography variant='body1'>
                            Register a Voluntime account to create and join organizations.
                        </Typography>
                        <br />
                        <Grid container className={classes.fullWidth} spacing={1}>
                            <Grid item lg={6} xs={12}>
                                <TextField onKeyDown={keyPress} onChange={event => setFirstName(event.target.value)} type='text' label='First Name' variant='outlined' className={classes.textField} fullWidth inputRef={props.fieldRef} />
                            </Grid>
                            <Grid item lg={6} xs={12}>
                                <TextField onKeyDown={keyPress} onChange={event => setLastName(event.target.value)} type='text' label='Last Name' variant='outlined' className={classes.textField} fullWidth />
                            </Grid>
                        </Grid>
                        <TextField onKeyDown={keyPress} onChange={event => setEmail(event.target.value)} type='email' label='Email Address' variant='outlined' fullWidth className={classes.textField} /><br />
                        <TextField onKeyDown={keyPress} onChange={event => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} label='Password' variant='outlined' fullWidth className={classes.textField}
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
                            }} />
                        <Button disabled={loading} onClick={handleSubmit} startIcon={loading && <CircularProgressButton />} variant='contained' color='primary' fullWidth className={classes.button}>
                            SIGN UP
                        </Button>
                        <br />
                        {
                            error.length > 0 &&
                            <Alert severity='error'>{error}</Alert>
                        }
                        <br /><br />
                        <GoogleLogin
                            clientId='978484937841-gg9qpc12jq2ccdom9mqv5mjbibfgu886.apps.googleusercontent.com'
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy='single_host_origin'
                            render={renderProps => (
                                <Button startIcon={<GoogleIcon />} className={classes.googleLogin} onClick={renderProps.onClick} disabled={renderProps.disabled} variant='contained' autoCapitalize='false'>Sign up with Google</Button>
                            )}
                        /><br /><br />
                        {/*<AppleLogin
                            clientId='com.mittaldev.voluntime-service'
                            redirectURI='https://voluntime.mittaldev.com/apple-login'
                            scope='email name'
                            responseMode='fragment'
                            responseType='code id_token'
                            render={props => <Button startIcon={<AppleIcon />} className={classes.appleLogin} {...props}>Sign up with Apple</Button>}
                        />*/}
                        <Grid container justify='center' className={classes.toggle}>
                            <Grid item>
                                Have an account? <Button variant='text' color='primary' onClick={() => props.setView('login')}>Login</Button>
                            </Grid>
                        </Grid>
                    </div>
            }
        </>
    );
};

export default SignUp;