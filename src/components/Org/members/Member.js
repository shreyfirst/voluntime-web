import { useState } from 'react';
import { Grid, Card, CardContent, Typography, IconButton, Menu, MenuItem, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline as EmailIcon, Phone as PhoneIcon, Instagram as InstagramIcon, Edit as EditIcon, RemoveCircleOutline as RemoveIcon, KeyboardArrowDown as OpenMenuIcon } from '@material-ui/icons';
import ConfirmRemove from './ConfirmRemove';
import { changeRole } from '../../../services/orgs';

const roleNames = { owner: 'Owner', admin: 'Administrator', vol: 'Volunteer' };
const roleColors = (theme, role) => ({ owner: theme.palette.primary.main, admin: theme.palette.secondary.main, vol: theme.palette.success.main }[role]);

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
    header: props => ({
        fontWeight: 'bold',
        color: roleColors(theme, props.role)
    }),
    editMenuRoleName: props => ({
        color: roleColors(theme, props.role)
    }),
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

const EditMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const close = () => setAnchorEl(null);

    const handleSelect = to => {
        setLoading(true);
        changeRole({
            token: props.token,
            userId: props.member.id,
            orgId: props.org.id,
            role: to
        }, (err, data) => {
            setLoading(false);
            if (err) {
                props.setError(data.message);
            } else {
                props.setError('');
                props.setEdit(false);
                let newMembers = [...props.members];
                newMembers[newMembers.findIndex(m => m.id === props.member.id)].role = data.role;
                props.setMembers(newMembers);
            }
        });
    };

    const classes = useStyles({ role: props.member.role });
    return (
        <>
            {
                loading &&
                <CircularProgress color='secondary' size={28} className={classes.loading} />
            }
            <Button variant='outlined' onClick={handleClick} endIcon={<OpenMenuIcon />} className={classes.editMenuRoleName}>
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

const Member = props => {
    const member = props.member;

    const [edit, setEdit] = useState(false);
    const [error, setError] = useState('');
    const [removeOpen, setRemoveOpen] = useState(false);

    const classes = useStyles({ role: member.role });
    return (
        <Card className={`${classes.container} ${props.table ? classes.containerTable : ''}`}>
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
                        {
                            edit
                                ? <EditMenu token={props.user.token} member={member} org={props.org} members={props.members} setMembers={props.setMembers} setError={setError} setEdit={setEdit} />
                                : <div className={classes.header}>{roleNames[member.role]}</div>
                        }
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
                {
                    props.org.role === 'owner' && member.id !== props.user.id &&
                    (edit
                        ? <div className={classes.cornerButton}><Button onClick={() => setRemoveOpen(true)} variant='outlined' startIcon={<RemoveIcon />} className={classes.removeButton}>Remove Member</Button><Button onClick={() => { setError(''); setEdit(false); }} variant='outlined'>Cancel</Button></div>
                        : <IconButton onClick={() => setEdit(true)} className={classes.cornerButton}><EditIcon /></IconButton>)
                }
                {
                    error.length > 0 &&
                    <><Alert severity='error'>{error}</Alert><br /></>
                }
            </CardContent>
            <ConfirmRemove open={removeOpen} setOpen={setRemoveOpen} user={props.user} setUser={props.setUser} org={props.org} member={member} members={props.members} setMembers={props.setMembers} />
        </Card>
    );
};

export default Member;