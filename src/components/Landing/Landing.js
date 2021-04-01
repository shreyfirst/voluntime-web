import { useRef, useState, useEffect, memo } from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Product from './Product';
import About from './About';

const useStyles = makeStyles(theme => ({
    landingContainer: {
        minHeight: '100vh',
        paddingTop: '4vh',
        paddingBottom: '4vh',
        boxSizing: 'border-box',
    },
    productContainer: {
        paddingRight: '5%',
    },
    loginPaper: {
        backgroundColor: '#F0F0F0',
        textAlign: 'center',
        paddingTop: '10%',
        boxSizing: 'border-box',
        paddingLeft: '5%',
        paddingRight: '5%',
        width: '90%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    about: {
        height: '100vh',
        textAlign: 'left',
    },
    bold: {
        fontWeight: 'bold'
    }
}));

const Landing = props => {
    const location = useLocation();

    const classes = useStyles();

    const [view, setView] = useState('login');

    const aboutRef = useRef(null);
    const signUpFieldRef = useRef(null);

    const focusSignUpField = () => signUpFieldRef.current.focus({ preventScroll: true });

    const scrollToAbout = () => aboutRef.current.scrollIntoView({ behavior: 'smooth' });

    const aboutSignUpClicked = () => {
        if (view !== 'signup') {
            setTimeout(focusSignUpField, 100);
            setView('signup');
        } else {
            focusSignUpField();
        }
        document.body.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => window.scrollTo(0, 0), []);

    //when app is ready, wrap login/signup grid in <Hidden xsDown></Hidden>
    return (
        <Container>
            <Grid container justify='center' className={classes.landingContainer}>
                <Grid container item alignItems='stretch' justify='center' className={classes.productContainer} md={6} sm={9} xs={12}>
                    <Product scrollToAbout={scrollToAbout} />
                </Grid>
                <Grid container item alignItems='stretch' justify='center' md={6} sm={9} xs={12}>
                    <Paper className={classes.loginPaper} variant='outlined'>
                        {
                            view === 'login'
                                ? <Login from={location.state === undefined ? undefined : location.state.from} setUser={props.setUser} setView={setView} />
                                : <SignUp from={location.state === undefined ? undefined : location.state.from} user={props.user} setUser={props.setUser} fieldRef={signUpFieldRef} setView={setView} />
                        }
                    </Paper>
                </Grid>
            </Grid>
            <Grid ref={aboutRef} container className={classes.about} alignItems='center' justify='center' spacing={4}>
                <About aboutSignUpClicked={aboutSignUpClicked} />
            </Grid>
        </Container>
    );
};

export default memo(Landing);