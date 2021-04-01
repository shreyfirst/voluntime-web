import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline as EmailIcon, Phone as PhoneIcon, Instagram as InstagramIcon } from '@material-ui/icons';

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
    contact: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingBottom: 5,
    },
    contactValue: {
        marginLeft: 15,
        '& a': {
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
        }
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
    }
}));

const Contact = props => {
    const classes = useStyles();
    return (
        <div className={classes.contact}>
            {props.icon}
            <span className={classes.contactValue}><a href={props.href} target='_blank' rel='noopener noreferrer'>{props.children}</a></span>
        </div>
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
                    (member.contactInfo.email.length > 0 || member.contactInfo.phone.length > 0 || member.contactInfo.instagram.length > 0) &&
                    <br />
                }
                {
                    member.contactInfo.email.length > 0 &&
                    <Contact icon={<EmailIcon />} href={`mailto:${member.contactInfo.email}`}>{member.contactInfo.email}</Contact>
                }
                {
                    member.contactInfo.phone.length > 0 &&
                    <Contact icon={<PhoneIcon />} href={`tel:${member.contactInfo.phone}`}>{member.contactInfo.phone}</Contact>
                }
                {
                    member.contactInfo.instagram.length > 0 &&
                    <Contact icon={<InstagramIcon />} href={`https://instagram.com/${member.contactInfo.instagram.replace('@', '')}`}>{member.contactInfo.instagram}</Contact>
                }
            </CardContent>
        </Card>
    );
};

export default Member;