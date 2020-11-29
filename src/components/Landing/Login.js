import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

const Login = ({ setView }) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Typography variant="h4">
                Login
            </Typography>
            <br />
            <TextField type="email" label="Email Address" variant="outlined" fullWidth className={classes.textField} /><br />
            <TextField type="password" label="Password" variant="outlined" fullWidth className={classes.textField} />
            <Button variant="contained" color="primary" fullWidth className={classes.button}>LOGIN</Button>
            <Grid container justify="center" className={classes.toggle}>
                <Grid item>
                    Don't have an account? <Button variant="text" color="primary" onClick={() => setView('signup')}>Sign Up</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Login;