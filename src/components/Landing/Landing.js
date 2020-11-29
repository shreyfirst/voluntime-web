import { useState } from 'react';
import { Container, Grid, Hidden, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Login from './Login';
import SignUp from './SignUp';
import Product from './Product';

const useStyles = makeStyles({
    container: {
        height: '100vh',
        paddingTop: '4vh',
        paddingBottom: '4vh',
    },
    productContainer: {
        paddingRight: '5%',
    },
    loginPaper: {
        backgroundColor: '#F0F0F0',
        textAlign: 'center',
        paddingTop: '10%',
        boxSizing: "border-box",
        paddingLeft: '5%',
        paddingRight: '5%',
        width: '90%',
    }
});

const Landing = () => {
    const classes = useStyles();

    var [view, setView] = useState('login');

    return (
        <Container>
            <Grid container justify="center" className={classes.container}>
                <Grid container item alignItems="stretch" justify="center" className={classes.productContainer} md={6} xs={12}>
                    <Product />
                </Grid>
                <Hidden xsDown>
                    <Grid container item alignItems="stretch" justify="center" md={6} sm={9}>
                        <Paper className={classes.loginPaper} variant="outlined">
                            {view === 'login'
                                ? <Login setView={setView} />
                                : <SignUp setView={setView} />
                            }
                        </Paper>
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    );
};

export default Landing;