import { Grid, Typography, Button, Hidden, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { PersonAdd as SignUpIcon, Group as RolesIcon, Link as LinkIcon, Check as ApproveIcon, Publish as ExportIcon, Timeline as DataIcon, Build as MobileAppIcon, MoneyOff as FreeIcon } from '@material-ui/icons';
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
                <Typography variant='h3' className={classes.bold}>
                    About
                </Typography><br />
                <Typography variant='subtitle1'>
                    Voluntime is a volunteer hour tracking service focused on community service and organized volunteer efforts.
                    Anyone can create an organization and volunteers can join and begin logging hours immediately.
                    Voluntime was created as a solution to the complex problem of recording volunteer hours over multiple volunteers and organizations, so that nonprofits can focus more on helping their communities.
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant='h3' className={classes.bold}>
                    Features
                </Typography><br />
                <Typography variant='subtitle1'>
                    With Voluntime, you can create organizations to manage your volunteers with the click of a button.
                    Volunteers and administrators have hour logs always on hand in one place instead of dozens of loose spreadsheets and texts.
                    Voluntime offers powerful data analytics and visualization tools to help you achieve the most with your volunteer hours.
                    <br /><br />
                    <Grid container justify='center'>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <RolesIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Organization roles (Owner, Administrator, Volunteer)
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <LinkIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Shareable organization join link
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ApproveIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Approve/deny hour logs
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ExportIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Export hours for sharing or submission
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <DataIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Data visualization &amp; calculators
                                </ListItemText>
                                </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <MobileAppIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    Mobile app in development
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <FreeIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    All features free of charge
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Grid>
                </Typography>
            </Grid>
            <Grid container item xs={12} sm={9} justify='center' spacing={3}>
                <Grid item>
                    <Hidden xsDown>
                        <Button variant='contained' color='primary' startIcon={<SignUpIcon />} onClick={props.aboutSignUpClicked}>Create an Account</Button>
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