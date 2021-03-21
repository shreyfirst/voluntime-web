import { useState, memo, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Button, CircularProgress, useMediaQuery } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { PersonAdd as JoinIcon } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useParams, Link } from 'react-router-dom';
import { joinOrg, joinOrgInfo } from '../../services/orgs';
import CircularProgressButton from '../helpers/CircularProgressButton';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const useStyles = makeStyles({
    container: {
        minHeight: '100vh',
        paddingTop: '4vh',
        paddingBottom: '4vh',
        boxSizing: 'border-box',
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
    textField: {
        minWidth: 400,
        width: '60%',
    },
    button: {
        minWidth: 400,
        width: '60%',
        marginTop: 20,
        paddingTop: 8,
        paddingBottom: 8,
    },
    alert: {
        minWidth: 400,
        width: '60%',
        boxSizing: 'border-box'
    },
    description: {
        color: '#343434',
        '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#FBFBFB'
        },
        '& thead': {
            backgroundColor: '#e9ecef',
        },
        '& th': {
            padding: 20,
            wordWrap: 'break-word',
            border: '1px solid #dee2e6'
        },
        '& td': {
            padding: 20,
            wordWrap: 'break-word',
            border: '1px solid #dee2e6'
        }
    }
});

const JoinOrg = props => {

    const { invite } = useParams();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const [org, setOrg] = useState(null);
    const [loadingOrg, setLoadingOrg] = useState(false);
    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (invite === undefined || invite === null || invite.length < 1) {
            setLoadingOrg(false);
            setError('Invalid URL. Please make sure the URL is correct and try again.');
            return;
        }
        setLoadingOrg(true);
        joinOrgInfo(invite, (err, data) => {
            setLoadingOrg(false);
            if (err) {
                setError(data.message);
            } else {
                setOrg(data);
            }
        });
    }, []);

    const handleSubmit = () => {
        if (invite === undefined || invite === null || invite.length < 1) {
            setSuccess('');
            setError('Invalid URL. Please make sure the URL is correct and try again.');
            return;
        }
        setLoading(true);
        joinOrg({
            token: props.user.token,
            invite,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setSuccess('');
                setError(data.message);
            } else {
                setError('');
                let newUser = props.user;
                newUser.orgs.push(data);
                props.setUser(newUser);
                setSuccess('Success! ');
            }
        });
    };

    const classes = useStyles();
    return (
        <Container maxWidth={false} className={classes.container}>
            <Grid container justify='center' className={classes.gridContainer}>
                <Grid item>
                    <Typography variant='h3' className={classes.bold}>
                        Voluntime
                    </Typography><br /><br />
                </Grid>
                <Grid container item xs={12} justify='center'>
                    <Paper className={classes.paper}>
                        <Typography variant='h5'>
                            Join Organization
                        </Typography><br />
                        {
                            org === null
                                ? error.length < 1 && <CircularProgress color='secondary' size={40} />
                                : <>
                                    <Typography variant='body1'>
                                        Do you want to join this organization?
                                    </Typography><br /><br />
                                    <Typography variant='h5' className={classes.bold}>{org.name}</Typography><br />
                                    <Typography component='div'>
                                        <ReactMarkdown plugins={[gfm]}
                                            renderers={{ link: props => <a href={props.href} target='_blank' rel='noopener noreferrer'>{props.children}</a> }}
                                            className={classes.description}>{org.description}</ReactMarkdown>
                                    </Typography>
                                </>
                        }
                        <br /><br />
                        <Button disabled={loadingOrg || loading || error.length > 0} onClick={handleSubmit} startIcon={loading ? <CircularProgressButton /> : <JoinIcon />} variant='contained' color='primary' className={classes.button}>
                            Join Organization
                        </Button>
                        <br />
                        {
                            success.length > 0 &&
                            <Alert severity='success' className={classes.alert}>{success} {isMobile ? 'You may now log in to Voluntime.' : <Link to='/dashboard'>Continue to Dashboard</Link>}</Alert>
                        }
                        {
                            error.length > 0 &&
                            <Alert severity='error' className={classes.alert}>{error} {error.startsWith('You are already a member of ') && <Link to='/dashboard'>Continue to Dashboard</Link>}</Alert>
                        }
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default memo(JoinOrg);