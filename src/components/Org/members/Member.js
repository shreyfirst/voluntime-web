import { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline as EmailIcon, Phone as PhoneIcon, Instagram as InstagramIcon, Edit as EditIcon, RemoveCircleOutline as RemoveIcon, KeyboardArrowDown as OpenMenuIcon } from '@material-ui/icons';
import ConfirmRemove from './ConfirmRemove';
import { changeRole } from '../../../services/orgs';

const roleNames = { 'owner': 'Owner', 'admin': 'Administrator', 'vol': 'Volunteer' };

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: 5,
        marginBottom: 10,
        boxShadow: '0 2px 2px rgba(0,0,0,0.25)',
        position: 'relative'
    },
    containerTable: {
        boxShadow: 'none'
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
    roleDescription: {
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.64)'
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
    },
    loading: {
        position: 'absolute',
        right: 15,
        top: 15
    },
    cornerButton: {
        position: 'absolute',
        right: 10,
        bottom: 10
    },
    removeButton: {
        marginRight: 20,
        color: '#d73a49',
        borderColor: '#d73a49',
        '&:hover': {
            color: '#FFF',
            backgroundColor: '#d73a49',
        }
    },
}));

const Member = props => {
    const member = props.member;
    const classes = useStyles();

    const [edit, setEdit] = useState(false);
    const [error, setError] = useState('');
    const [removeOpen, setRemoveOpen] = useState(false);

    const Contact = props => (
        <div className={classes.contact}>
            {props.icon}
            <span className={classes.contactValue}>{props.value}</span>
        </div>
    );

    const EditMenu = () => {
        const [anchorEl, setAnchorEl] = useState(null);
        const [loading, setLoading] = useState(false);

        const handleClick = event => setAnchorEl(event.currentTarget);

        const close = () => setAnchorEl(null);

        const handleSelect = to => {
            setLoading(true);
            changeRole({
                token: props.user.token,
                userId: props.member.id,
                orgId: props.org.id,
                role: to
            }, (err, data) => {
                setLoading(false);
                if (err) {
                    setError(data.message);
                } else {
                    setError('');
                    setEdit(false);
                    var newMembers = [...props.members];
                    newMembers[newMembers.findIndex(m => m.id === member.id)].role = data.role;
                    props.setMembers(newMembers);
                }
            });
        };

        return (
            <>
                {
                    loading &&
                    <CircularProgress color='secondary' size={28} className={classes.loading} />
                }
                <Button variant='outlined' onClick={handleClick} endIcon={<OpenMenuIcon />} className={classes[props.member.role]}>
                    {roleNames[props.member.role]}
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={anchorEl !== null}
                    onClose={close}
                >
                    <MenuItem onClick={() => handleSelect('owner')}><div>Owner<Typography className={classes.roleDescription}>All permissions, everywhere</Typography></div></MenuItem>
                    <MenuItem onClick={() => handleSelect('admin')}><div>Administrator<Typography className={classes.roleDescription}>Manage volunteers' hours</Typography></div></MenuItem>
                    <MenuItem onClick={() => handleSelect('vol')}><div>Volunteer<Typography className={classes.roleDescription}>Log hours</Typography></div></MenuItem>
                </Menu>
            </>
        );
    };

    return (
        <Card className={`${classes.container} ${props.table ? classes.containerTable : ''}`}>
            <CardContent>
                {
                    edit
                        ? <EditMenu />
                        : <div className={`${classes.header} ${classes[member.role]}`}>{roleNames[member.role]}</div>
                }

                <Typography variant='h6'>{member.firstName} {member.lastName}</Typography>
                <Typography variant='body1' className={classes.note}>{member.note}</Typography>
                {
                    (member.contactInfo.email.length > 0 || member.contactInfo.phone.length > 0 || member.contactInfo.instagram.length > 0) &&
                    <br />
                }
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
                {
                    props.org.role !== 'vol' && member.id !== props.user.id &&
                    (edit
                        ? <div className={classes.cornerButton}><Button onClick={() => setRemoveOpen(true)} variant='outlined' startIcon={<RemoveIcon />} className={classes.removeButton}>Remove Member</Button><Button onClick={() => { setError(''); setEdit(false); }} variant='outlined'>Cancel</Button></div>
                        : <IconButton onClick={() => setEdit(true)} className={classes.cornerButton}><EditIcon /></IconButton>)
                }
                {
                    error.length > 0 &&
                    <><Alert severity="error">{error}</Alert><br /></>
                }
            </CardContent>
            <ConfirmRemove open={removeOpen} setOpen={setRemoveOpen} user={props.user} setUser={props.setUser} org={props.org} member={member} members={props.members} setMembers={props.setMembers} />
        </Card>
    );
};

export default Member;