import { useState, useRef } from 'react';
import { Typography, TextField, Grid, Button, Switch, List, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { MailOutline as EmailIcon, Phone as PhoneIcon, Instagram as InstagramIcon, Alarm as ApproveIcon, GroupAdd as NewMemberIcon, RemoveCircleOutline as OrgRemovedIcon, LockOutlined as LockIcon, Save as SaveIcon, ExitToApp as LogoutIcon } from '@material-ui/icons';
import DiscordIcon from '../../helpers/DiscordIcon';
import TextFieldIcon from '../../helpers/TextFieldIcon';
import CircularProgressButton from '../../helpers/CircularProgressButton';
import ImagePreview from '../../helpers/ImagePreview';
import LinearProgressWithLabel from '../../helpers/LinearProgressWithLabel';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import { editProfile } from '../../../services/users';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    helperText: {
        color: '#414141'
    }
});

const cancelEvent = event => {
    event.stopPropagation();
    event.preventDefault();
};

const Account = props => {

    const history = useHistory();

    const [encodedImage, setEncodedImage] = useState(null);
    const [compressProgress, setCompressProgress] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [fileName, setFileName] = useState(null);

    const fileInputRef = useRef(null);

    const [firstName, setFirstName] = useState(props.user.firstName);
    const [lastName, setLastName] = useState(props.user.lastName);
    const [note, setNote] = useState(props.user.note);

    const [emailLogStatus, setEmailLogStatus] = useState(props.user.emailPrefs?.logStatus === true);
    const [emailNewMember, setEmailNewMember] = useState(props.user.emailPrefs?.newMember === true);
    const [emailOrgRemoved, setEmailOrgRemoved] = useState(props.user.emailPrefs?.orgRemoved === true);

    const [contactEmail, setContactEmail] = useState(props.user.contactInfo.email);
    const [contactPhone, setContactPhone] = useState(props.user.contactInfo.phone);
    const [contactInstagram, setContactInstagram] = useState(props.user.contactInfo.instagram);
    const [contactDiscord, setContactDiscord] = useState(props.user.contactInfo.discord === undefined ? '' : props.user.contactInfo.discord);

    const [emailOpen, setEmailOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = () => {
        setSuccess('');
        if (firstName.length < 1) {
            setError('Please enter your first name.');
            return;
        }
        if (lastName.length < 1) {
            setError('Please enter your last name.');
            return;
        }

        setLoading(true);
        editProfile({
            token: props.user.token,
            firstName,
            lastName,
            note,
            contactInfo: {
                email: contactEmail,
                phone: contactPhone,
                instagram: contactInstagram,
                discord: contactDiscord,
            },
            emailPrefs: {
                logStatus: emailLogStatus,
                newMember: emailNewMember,
                orgRemoved: emailOrgRemoved,
            },
            image: encodedImage === null ? '' : encodedImage
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                setCompressProgress(null);
                setUploadProgress(null);
                fileInputRef.current.value = '';
                setSuccess('Your changes have been saved.');
                props.setUser({ ...data, orgs: props.user.orgs });
            }
        }, encodedImage !== null && setUploadProgress);
    };

    const logout = () => {
        localStorage.removeItem('user');
        history.push('/');
    };

    const classes = useStyles();
    return (
        <Grid container onDragOver={cancelEvent} onDrop={cancelEvent} className={classes.container}>
            <Grid item xs={11} sm={9} md={7} lg={5}>
                View and edit your Voluntime account here.
                <br /><br />
                <Typography variant='h6'>
                    Profile
                </Typography><br />
                <ImagePreview src={encodedImage === null ? props.user.image : encodedImage} maxWidthOrHeight={150} width={75} height={75} placeholder='No Profile Picture' fileInputRef={fileInputRef} setSuccess={setSuccess} setError={setError} fileName={fileName} setFileName={setFileName} progress={compressProgress} onProgress={setCompressProgress} onFinish={setEncodedImage} />
                <br /><br />
                <TextField variant='outlined' label='First Name' required onChange={e => setFirstName(e.target.value)} defaultValue={props.user.firstName} fullWidth /><br /><br />
                <TextField variant='outlined' label='Last Name' required onChange={e => setLastName(e.target.value)} defaultValue={props.user.lastName} fullWidth /><br /><br />
                <TextField variant='outlined' label='Note (additional info, public)' multiline rows={4} onChange={e => setNote(e.target.value)} defaultValue={props.user.note} fullWidth /><br /><br />
                <Typography variant='body1'>
                    Contact Information (Optional)
                </Typography><br />
                <TextFieldIcon variant='outlined' label='Public Email Address' icon={<EmailIcon />} type='email' onChange={e => setContactEmail(e.target.value)} defaultValue={props.user.contactInfo.email} fullWidth /><br />
                <TextFieldIcon variant='outlined' label='Public Phone Number' icon={<PhoneIcon />} type='tel' onChange={e => setContactPhone(e.target.value)} defaultValue={props.user.contactInfo.phone} fullWidth /><br />
                <TextFieldIcon variant='outlined' label='Public Instagram Handle' icon={<InstagramIcon />} onChange={e => setContactInstagram(e.target.value)} defaultValue={props.user.contactInfo.instagram} fullWidth /><br />
                <TextFieldIcon variant='outlined' label='Public Discord Tag' icon={<DiscordIcon />} onChange={e => setContactDiscord(e.target.value)} defaultValue={props.user.contactInfo?.discord} fullWidth />
                <br /><br />
                <Typography variant='body1'>
                    Email Preferences
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ApproveIcon />
                        </ListItemIcon>
                        <ListItemText id='emailLogStatus' primary='Your hour log is approved/denied' />
                        <ListItemSecondaryAction>
                            <Switch
                                color='primary'
                                edge='end'
                                onChange={() => setEmailLogStatus(!emailLogStatus)}
                                checked={emailLogStatus}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <NewMemberIcon />
                        </ListItemIcon>
                        <ListItemText id='emailNewMember' primary='Member joins organization you own' />
                        <ListItemSecondaryAction>
                            <Switch
                                color='primary'
                                edge='end'
                                onChange={() => setEmailNewMember(!emailNewMember)}
                                checked={emailNewMember}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <OrgRemovedIcon />
                        </ListItemIcon>
                        <ListItemText id='emailOrgRemoved' primary='You are removed from an organization' />
                        <ListItemSecondaryAction>
                            <Switch
                                color='primary'
                                edge='end'
                                onChange={() => setEmailOrgRemoved(!emailOrgRemoved)}
                                checked={emailOrgRemoved}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>

                <Grid container justify='flex-end'>
                    <Button variant='contained' color='primary' disabled={loading} onClick={handleSubmit} startIcon={loading ? <CircularProgressButton /> : <SaveIcon />}>
                        Save Changes
                    </Button>
                </Grid>
                {
                    loading && uploadProgress !== null &&
                    <>
                        Uploading:<br />
                        <LinearProgressWithLabel value={uploadProgress === 100 ? 99 : uploadProgress} />
                    </>
                }
                <br />
                {
                    success.length > 0 &&
                    <Alert severity='success'>{success}</Alert>
                }
                {
                    error.length > 0 &&
                    <Alert severity='error'>{error}</Alert>
                }

                <Typography variant='h6'>
                    Account
                </Typography>
                <Typography variant='body2' className={classes.helperText}>
                    This is private information and will not be shown to other users.
                </Typography><br />
                Email Address:{' '}
                <Button variant='outlined' onClick={() => setEmailOpen(true)} startIcon={<EmailIcon />}>Change Email</Button>
                <br /><br /><br />
                Password:{' '}
                {
                    props.user.method === 'google' //CHANGE TO GOOGLE
                        ? 'Use Sign in with Google instead of a password.'
                        : <Button variant='outlined' onClick={() => setPasswordOpen(true)} startIcon={<LockIcon />}>Change Password</Button>
                }
                <br /><br /><br />
                <Grid container justify='center'>
                    <Button variant='outlined' onClick={logout} startIcon={<LogoutIcon />}>Log Out</Button>
                </Grid>
                <ChangeEmail open={emailOpen} setOpen={setEmailOpen} user={props.user} setUser={props.setUser} />
                <ChangePassword open={passwordOpen} setOpen={setPasswordOpen} user={{ token: props.user.token }} setUser={props.setUser} />
            </Grid>
        </Grid>
    );
};

export default Account;