import { memo } from 'react';
import { Grid, Typography, Button, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReactStoreBadges from 'react-store-badges';

const useStyles = makeStyles({
    bold: {
        fontWeight: 'bold'
    }
});

const About = props => {

    const signUpClicked = () => {
        if (props.path !== '/signup') {
            setTimeout(() => props.focusSignUpField(true), 100); props.setPath('signup');
        } else {
            props.focusSignUpField();
        }
        props.scrollToTop();
    };

    const classes = useStyles();
    return (
        <>
            <Grid item xs={9}>
                <Typography variant="h3" className={classes.bold}>
                    About
                </Typography><br />
                <Typography variant="subtitle1">
                    Voluntime is a volunteer hour tracking service focused on community service and organized volunteer efforts. Anyone can create an organization and volunteers can join and begin logging hours immediately.
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant="h3" className={classes.bold}>
                    Features
                </Typography><br />
                <Typography variant="subtitle1">
                    Create organizations to manage your volunteers. Have hour logs always on hand in one place instead of dozens of loose spreadsheets.
                </Typography>
            </Grid>
            <Grid container item xs={12} sm={9} justify="center" spacing={3}>
                <Grid item>
                    <Hidden xsDown>
                        <Button variant="contained" color="primary" onClick={signUpClicked}>Create an Account</Button>
                    </Hidden>
                    <Hidden smUp>
                        <Grid container spacing={1}>
                            <Grid item>
                                <ReactStoreBadges
                                    platform='ios'
                                    url='https://mittaldev.com'
                                    locale='en-us'
                                />
                            </Grid>
                            <Grid item>
                                <ReactStoreBadges
                                    platform='android'
                                    url='https://mittaldev.com'
                                    locale='en'
                                />
                            </Grid>
                        </Grid>
                    </Hidden>
                </Grid>
            </Grid>
        </>
    );
}

export default memo(About);