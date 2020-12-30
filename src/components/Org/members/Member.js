import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline as EmailIcon, Phone as PhoneIcon, Instagram as InstagramIcon } from '@material-ui/icons';

const roleNames = { 'owner': 'Owner', 'admin': 'Administrator', 'vol': 'Volunteer' };

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: 5,
        marginBottom: 10,
        boxShadow: '0 2px 2px rgba(0,0,0,0.25)',
    },
    header: {
        fontWeight: 'bold',

    },
    owner: {
        color: theme.palette.primary.main
    },
    admin: {
        color: theme.palette.secondary.main
    },
    vol: {
        color: theme.palette.success.main
    },
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
        marginLeft: 15
    }
}));

const Member = props => {
    const member = props.member;
    const classes = useStyles();

    const Contact = props => (
        <div className={classes.contact}>
            {props.icon}
            <span className={classes.contactValue}>{props.value}</span>
        </div>
    );

    return (
        <Card className={classes.container}>
            
            <CardContent>
            <div className={`${classes.header} ${classes[member.role]}`}>{roleNames[member.role]}</div>
                <Typography variant='h6'>{member.firstName} {member.lastName}</Typography>
                <Typography variant='body1' className={classes.note}>{member.note}</Typography>
                <br />
                {
                    member.contactInfo.email.length > 0 &&
                    <Contact icon={<EmailIcon />} value={member.contactInfo.email} />
                }
                {
                    member.contactInfo.phone.length > 0 &&
                    <Contact icon={<PhoneIcon />} value={member.contactInfo.phone} />
                }
                {
                    member.contactInfo.instagram.length > 0 &&
                    <Contact icon={<InstagramIcon />} value={member.contactInfo.instagram} />
                }
            </CardContent>
        </Card>
    );
};

export default Member;