import { useState } from 'react';
import { Grid, Typography, TextField, Button, InputAdornment, IconButton, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { createUser } from '../../services';
import VerifyEmail from './VerifyEmail';

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
    }
});

const SignUp = props => {

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

    const classes = useStyles();
    return (
        <>
            {
                view === 'verify'
                    ? <VerifyEmail user={{ ...props.user, password }} setUser={props.setUser} setView={setView} />
                    : <div className={classes.container}>
                        <Typography variant="h4">
                            Sign Up
                        </Typography>
                        <Typography variant="body1">
                            Register a Voluntime account to create and join organizations.
                        </Typography>
                        <br />
                        <Grid container className={classes.fullWidth} spacing={1}>
                            <Grid item lg={6} xs={12}>
                                <TextField onKeyDown={keyPress} onChange={event => setFirstName(event.target.value)} type="text" label="First Name" variant="outlined" className={classes.textField} fullWidth inputRef={props.fieldRef} />
                            </Grid>
                            <Grid item lg={6} xs={12}>
                                <TextField onKeyDown={keyPress} onChange={event => setLastName(event.target.value)} type="text" label="Last Name" variant="outlined" className={classes.textField} fullWidth />
                            </Grid>
                        </Grid>
                        <TextField onKeyDown={keyPress} onChange={event => setEmail(event.target.value)} type="email" label="Email Address" variant="outlined" fullWidth className={classes.textField} /><br />
                        <TextField onKeyDown={keyPress} onChange={event => setPassword(event.target.value)} type={showPassword ? "text" : "password"} label="Password" variant="outlined" fullWidth className={classes.textField}
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
                            }} />
                        <Button disabled={loading} onClick={handleSubmit} variant="contained" color="primary" fullWidth className={classes.button}>
                            {
                                loading
                                    ? <CircularProgress size={24} color='secondary' />
                                    : 'SIGN UP'
                            }
                        </Button>
                        <br />
                        {
                            error.length > 0 &&
                            <Alert severity="error">{error}</Alert>
                        }
                        <Grid container justify="center" className={classes.toggle}>
                            <Grid item>
                                Have an account? <Button variant="text" color="primary" onClick={() => props.setView('login')}>Login</Button>
                            </Grid>
                        </Grid>
                    </div>
            }
        </>
    );
};

export default SignUp;