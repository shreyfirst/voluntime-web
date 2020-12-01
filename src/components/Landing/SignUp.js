import { useState } from 'react';
import { Grid, Typography, TextField, Button, InputAdornment, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
//import { createUser } from '../../services';

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

    var [showPassword, setShowPassword] = useState(false);

    /*var [firstName, setFirstName] = useState('');
    var [lastName, setLastName] = useState('');
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');

    const signUpClicked = () => {
        createUser();
    }*/

    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Typography variant="h4">
                Sign Up
            </Typography>
            <Typography variant="body1">
                Register a Voluntime account to create and join organizations.
            </Typography>
            <br />
            <Grid container className={classes.fullWidth} spacing={1}>
                <Grid item lg={6} xs={12}>
                    <TextField type="text" label="First Name" variant="outlined" className={classes.textField} fullWidth inputRef={props.fieldRef} />
                </Grid>
                <Grid item lg={6} xs={12}>
                    <TextField type="text" label="Last Name" variant="outlined" className={classes.textField} fullWidth />
                </Grid>
            </Grid>
            <TextField type="email" label="Email Address" variant="outlined" fullWidth className={classes.textField} /><br />
            <TextField type={showPassword ? "text" : "password"} label="Password" variant="outlined" fullWidth className={classes.textField}
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
            <Button variant="contained" color="primary" fullWidth className={classes.button}>SIGN UP</Button>
            <Grid container justify="center" className={classes.toggle}>
                <Grid item>
                    Have an account? <Button variant="text" color="primary" onClick={() => props.setPath('login')}>Login</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default SignUp;