import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Assignment as CopyIcon, Done as DoneIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { createInviteLink } from '../../../services/orgs';

const useStyles = makeStyles({
    url: {
        wordBreak: 'break-all'
    }
});
const InviteLink = props => {

    const [loading, setLoading] = useState(props.url === null);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    const closeDialog = () => {
        setError('');
        props.setOpen(false);
    };

    useEffect(() => {
        if (props.url === null) {
            createInviteLink({
                token: props.user.token,
                id: props.org.id,
            }, (err, data) => {
                setLoading(false);
                if (err) {
                    setError(data.message);
                } else {
                    setError('');
                    props.setUrl(data.url);
                }
            });
        }
    }, []);

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={closeDialog} fullWidth>
            <DialogTitle>Invite Link</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Send this invite link to your volunteers for them to join this organization. The link expires in 7 days.
                </DialogContentText>
                {
                    props.url !== null &&
                    <Link href={props.url} target={`join-${props.org.id}`} className={classes.url}>
                        {props.url}
                    </Link>
                }
                {loading &&
                    <CircularProgress color='secondary' size={40} />}
                {error.length > 0 &&
                    <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions>
                {navigator.clipboard !== undefined &&
                    <Button disabled={loading} onClick={() => navigator.clipboard.writeText(props.url).then(() => setCopied(true))} variant='outlined' startIcon={copied ? <DoneIcon /> : <CopyIcon />}>
                        Copy Link
                    </Button>}
                <Button variant='contained' color='primary' onClick={closeDialog}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteLink;