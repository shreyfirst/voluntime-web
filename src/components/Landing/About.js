import { Grid, Typography, Button, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppStoreBadge from './AppStoreBadge';

const useStyles = makeStyles({
    bold: {
        fontWeight: 'bold'
    }
});

const About = props => {
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
                        <Button variant="contained" color="primary" onClick={props.aboutSignUpClicked}>Create an Account</Button>
                    </Hidden>
                    <Hidden smUp>
                        <Grid container spacing={1}>
                            <Grid item>
                                <AppStoreBadge
                                    platform='ios'
                                    url='https://mittaldev.com'
                                />
                            </Grid>
                            <Grid item>
                                <AppStoreBadge
                                    platform='android'
                                    url='https://mittaldev.com'
                                />
                            </Grid>
                        </Grid>
                    </Hidden>
                </Grid>
            </Grid>
        </>
    );
}

export default About;