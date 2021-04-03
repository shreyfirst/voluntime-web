import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline as EmailIcon, Phone as PhoneIcon, Instagram as InstagramIcon } from '@material-ui/icons';
import DiscordIcon from '../../../helpers/DiscordIcon';

const roleNames = { owner: 'Owner', admin: 'Administrator', vol: 'Volunteer' };
const roleColors = (theme, role) => ({ owner: theme.palette.primary.main, admin: theme.palette.secondary.main, vol: theme.palette.success.main }[role]);

const useStyles = makeStyles(theme => ({
    container: {
        boxShadow: 'none',
        position: 'relative',
        marginBottom: -20,
    },
    header: props => ({
        fontWeight: 'bold',
        color: roleColors(theme, props.role)
    }),
    note: {
        color: 'rgba(0, 0, 0, 0.64)'
    },
    contactValue: {
        marginLeft: -10,
        color: '#000',
        textDecoration: 'none',
        '&:visited': {
            color: '#000',
            textDecoration: 'none',
        },
        '&:active': {
            color: '#000',
            textDecoration: 'none',
        },
        '&:hover': {
            color: '#000',
            textDecoration: 'none',
        },
        '&:focus': {
            color: '#000',
            textDecoration: 'none',
        },
    },
    image: {
        borderRadius: '50%',
        display: 'inline',
        border: '1px solid black',
    },
    imagePlaceholder: props => ({
        borderRadius: '50%',
        display: 'inline-block',
        border: `1px solid ${roleColors(theme, props.role)}`,
        minHeight: 75,
        minWidth: 75,
    }),
    imageText: {
        paddingLeft: 15,
        paddingTop: 12,
    },
    contactItem: {
        padding: 0
    }
}));

const Contact = props => {
    const classes = useStyles();
    return (
        <a href={props.href} target='_blank' rel='noopener noreferrer' className={classes.contactValue}>{props.value}</a>
    );
};

const Member = props => {
    const member = props.member;

    const classes = useStyles({ role: member.role });
    return (
        <Card className={classes.container}>
            <CardContent>
                <Grid container style={{ paddingBottom: 3 }}>
                    <Grid item>
                        {
                            member.image?.length > 0
                                ? <img src={member.image} height={75} width={75} alt='' className={classes.image} />
                                : <div className={classes.imagePlaceholder}></div>
                        }

                    </Grid>
                    <Grid item className={classes.imageText}>
                        <div className={classes.header}>{roleNames[member.role]}</div>

                        <Typography variant='h6'>{member.firstName} {member.lastName}</Typography>
                    </Grid>
                </Grid>
                <Typography variant='body1' className={classes.note}>{member.note}</Typography>
                {
                    (member.contactInfo.email.length > 0 || member.contactInfo.phone.length > 0 || member.contactInfo.instagram.length > 0 || member.contactInfo.discord?.length > 0) &&
                    <List>
                        {
                            member.contactInfo.email.length > 0 &&
                            <ListItem className={classes.contactItem}>
                                <ListItemIcon>
                                    <EmailIcon />
                                </ListItemIcon>
                                <ListItemText id='contactEmail' primary={<Contact href={`mailto:${member.contactInfo.email}`} value={member.contactInfo.email} />} />
                            </ListItem>
                        }
                        {
                            member.contactInfo.phone.length > 0 &&
                            <ListItem className={classes.contactItem}>
                                <ListItemIcon>
                                    <PhoneIcon />
                                </ListItemIcon>
                                <ListItemText id='contactPhone' primary={<Contact href={`tel:${member.contactInfo.phone}`} value={member.contactInfo.phone} />} />
                            </ListItem>
                        }
                        {
                            member.contactInfo.instagram.length > 0 &&
                            <ListItem className={classes.contactItem}>
                                <ListItemIcon>
                                    <InstagramIcon />
                                </ListItemIcon>
                                <ListItemText id='contactInstagram' primary={<Contact href={`https://instagram.com/${member.contactInfo.instagram.replace('@', '')}`} value={member.contactInfo.instagram} />} />
                            </ListItem>
                        }
                        {
                            member.contactInfo.discord?.length > 0 &&
                            <ListItem className={classes.contactItem}>
                                <ListItemIcon>
                                    <DiscordIcon list />
                                </ListItemIcon>
                                <ListItemText id='contactDiscord' primary={<Contact href='https://discord.com/' value={member.contactInfo.discord} />} />
                            </ListItem>
                        }
                    </List>
                }
            </CardContent>
        </Card>
    );
};

export default Member;