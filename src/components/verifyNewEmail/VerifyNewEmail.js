import { useState, memo, useEffect } from 'react';
import { Container, Grid, Typography, Paper, CircularProgress, useMediaQuery } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useParams, Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { verifyNewEmail } from '../../services/users';

const useStyles = makeStyles({
    container: {
        minHeight: '100vh',
        paddingTop: '4vh',
        paddingBottom: '4vh',
        boxSizing: "border-box",
        backgroundColor: '#f7f7f7',
    },
    gridContainer: {
        width: '100%'
    },
    paper: {
        width: 960,
        maxWidth: 960,
        paddingLeft: '3%',
        paddingRight: '3%',
        paddingTop: '2%',
        paddingBottom: '3%',
    },
    bold: {
        fontWeight: 'bold'
    },
    pleaseWait: {
        textAlign: 'center',
    },
});

const VerifyNewEmail = ({ setUser }) => {

    const { id } = useParams();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (id === undefined || id === null || id.length < 1) {
            setError('Invalid URL! Make sure the URL is the same as what you recieved in your email and try again.');
            return;
        }

        verifyNewEmail(id, (err, data) => {
            if (err) {
                setError(data.message);
            } else {
                setUser(data);
                setSuccess('Your email address has been updated!');
            }
        });
    }, [id, setUser]);

    const classes = useStyles();
    return (
        <Container maxWidth={false} className={classes.container}>
            <Grid container justify="center" className={classes.gridContainer}>
                <Grid item>
                    <Typography variant="h3" className={classes.bold}>
                        Voluntime
                    </Typography><br /><br />
                </Grid>
                <Grid container item xs={12} justify="center">
                    <Paper className={classes.paper}>
                        <Typography variant="h5">
                            Verify New Email
                        </Typography>
                        <br />
                        {
                            success.length === 0 && error.length === 0 &&
                            <div className={classes.pleaseWait}>
                                <CircularProgress size={48} thickness={5} color='primary' />
                                <Typography variant="body1">Verifying new email...</Typography>
                            </div>
                        }
                        {
                            success.length > 0 &&
                            <Alert severity="success">{success} {isMobile ? 'You may now log in to Voluntime.' : <Link to='/dashboard'>Continue to Voluntime</Link>}</Alert>
                        }
                        {
                            error.length > 0 &&
                            <Alert severity="error">{error}</Alert>
                        }
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default memo(VerifyNewEmail);