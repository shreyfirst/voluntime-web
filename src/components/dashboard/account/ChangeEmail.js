import { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Tabs, Tab } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import GoogleLogin from 'react-google-login';
import GoogleIcon from '../../helpers/GoogleIcon';
import TabPanel from '../../helpers/TabPanel';

const useStyles = makeStyles({
    textField: {
        minWidth: '32em'
    },
    tabPanel: {
        minHeight: 100,
        textAlign: 'center',
        paddingTop: 20,
    },
    googleLogin: {
        textTransform: 'none',
        backgroundColor: '#FFF',
        minWidth: '50%'
    },
});

const ChangeEmail = props => {

    const [tab, setTab] = useState(0);
    const [googleInfo, setGoogleInfo] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const closeDialog = () => props.setOpen(false);

    const responseGoogle = response => {
        if (response.error === undefined) {
            console.log(JSON.stringify(response, null, 2))
            setGoogleInfo({ email: response.profileObj.email, token: response.tokenObj.id_token });
        } else {
            if (response.error === 'idpiframe_initialization_failed') {
                setError('Cookies must be enabled to use Sign in with Google.');
            } else {
                setError('Sign in with Google is not available right now.');
            }
        }
    };

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={closeDialog}>
            <DialogTitle>Change Email</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This is your private email address and will not be shown to other users.<br />
                    You will need to verify that you own your new email address before it changes, either through Google or a verification email.<br />
                </DialogContentText>
                <Tabs
                    value={tab}
                    onChange={(e, newTab) => setTab(newTab)}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab value={0} label="Google" />
                    <Tab value={1} label="Verification Email" />
                </Tabs>
                <TabPanel tabValue={0} tabIndex={tab} className={classes.tabPanel}>
                    <GoogleLogin
                        clientId="978484937841-gg9qpc12jq2ccdom9mqv5mjbibfgu886.apps.googleusercontent.com"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy='single_host_origin'
                        render={renderProps => (
                            <Button startIcon={<GoogleIcon />} className={classes.googleLogin} onClick={renderProps.onClick} disabled={renderProps.disabled} variant='contained' autoCapitalize='false'>Change Email with Google</Button>
                        )}
                    />
                    {
                        googleInfo
                            ? <><br />Selected: {googleInfo.email}</>
                            : <><br />No Email Selected</>
                    }
                </TabPanel>
                <TabPanel tabValue={1} tabIndex={tab} className={classes.tabPanel}>
                    <TextField variant='outlined' type='email' label='New Email Address' onChange={event => setEmail(event.target.value)} className={classes.textField} /><br /><br />
                </TabPanel>
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={closeDialog} color="primary">
                    Cancel
                </Button>
                <Button variant='contained' onClick={closeDialog} color="primary">
                    Change Email
                </Button>
            </DialogActions>
            {
                error.length > 0 &&
                <Alert severity="error">{error}</Alert>
            }
        </Dialog>
    );
};

export default ChangeEmail;