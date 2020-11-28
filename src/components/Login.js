import { Grid, Paper, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    grid: {
        height: '100vh',
    },
    paper: {
        width: '60%',
        height: '80%',
    }
});

const Login = () => {
    const classes = useStyles();
    return (
        <Grid
            container
            spacing={0}
            alignItems="center"
            justify="center"
            className={classes.grid}
        >
            <Grid item xs={12} >
                <Paper className={classes.paper} variant="outlined">
                    <Typography variant="h4">
                        Login
                </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Login;