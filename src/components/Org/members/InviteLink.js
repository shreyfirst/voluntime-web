import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Assignment as CopyIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { createInviteLink } from '../../../services/orgs';

const useStyles = makeStyles({
    url: {
        wordBreak: 'break-all'
    }
});
const InviteLink = props => {

    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const closeDialog = () => {
        setError('');
        props.setOpen(false);
    };

    useEffect(() => {
        createInviteLink({
            token: props.user.token,
            id: props.org.id,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                setUrl(data.url);
            }
        });
    }, []);

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={closeDialog} fullWidth>
            <DialogTitle>Invite Link</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Send this invite link to your volunteers for them to join this organization. The link expires in 7 days.
                </DialogContentText>
                <Link href={url} target={`join-${props.org.id}`} className={classes.url}>
                    {url}
                </Link>
                {loading &&
                    <CircularProgress color='secondary' size={40} />}
                {error.length > 0 &&
                    <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' startIcon={<CopyIcon />}>
                    Copy Link
                </Button>
                <Button variant='contained' color='primary' onClick={closeDialog}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteLink;