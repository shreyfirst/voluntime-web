import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Container, Grid, Hidden, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Login from './Login';
import SignUp from './SignUp';
import Product from './Product';
import About from './About';

const useStyles = makeStyles({
    landingContainer: {
        minHeight: '100vh',
        paddingTop: '4vh',
        paddingBottom: '4vh',
        boxSizing: "border-box",
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
    },
    about: {
        height: '100vh',
        textAlign: 'left',
    },
    bold: {
        fontWeight: 'bold'
    }
});

const Landing = () => {
    const classes = useStyles();

    var [view, setView] = useState('login');

    const aboutRef = useRef(null);
    const signUpFieldRef = useRef(null);

    var focusField = useRef(false);
    const setFocusField = (setTo) => { focusField.current = setTo; };

    useEffect(() => {
        if (focusField.current) {
            focusSignUpField();
            focusField.current = false;
        }
    }, [view]);

    const focusSignUpField = () => signUpFieldRef.current.focus({ preventScroll: true });

    const scrollToAbout = useCallback(() => aboutRef.current.scrollIntoView({ behavior: 'smooth' }), []);
    const scrollToTop = () => document.body.scrollIntoView({ behavior: 'smooth' });

    return (
        <Container>
            <Grid container justify="center" className={classes.landingContainer}>
                <Grid container item alignItems="stretch" justify="center" className={classes.productContainer} md={6} sm={9} xs={12}>
                    <Product scrollToAbout={scrollToAbout} />
                </Grid>
                <Hidden xsDown>
                    <Grid container item alignItems="stretch" justify="center" md={6} sm={9}>
                        <Paper className={classes.loginPaper} variant="outlined">
                            {view === 'login'
                                ? <Login setView={setView} />
                                : <SignUp fieldRef={signUpFieldRef} setView={setView} />
                            }
                        </Paper>
                    </Grid>
                </Hidden>
            </Grid>
            <Grid ref={aboutRef} container className={classes.about} alignItems="center" justify="center">
                <About view={view} setView={setView} scrollToTop={scrollToTop} setFocusField={setFocusField} focusSignUpField={focusSignUpField} />
            </Grid>
        </Container>
    );
};

export default memo(Landing);