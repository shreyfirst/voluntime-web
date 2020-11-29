import { useState } from 'react';
import { Grid, Typography, TextField, Button, InputAdornment, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';

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
    toggle: {
        position: 'absolute',
        bottom: '5%',
    }
});

const SignUp = ({ setView }) => {

    var [showPassword, setShowPassword] = useState(false);

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
            <TextField type="text" label="First Name" variant="outlined" fullWidth className={classes.textField} /><br />
            <TextField type="text" label="Last Name" variant="outlined" fullWidth className={classes.textField} /><br />
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
                    Have an account? <Button variant="text" color="primary" onClick={() => setView('login')}>Login</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default SignUp;