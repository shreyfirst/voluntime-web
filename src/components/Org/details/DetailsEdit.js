import { useState } from 'react';
import { Typography, TextField, Grid, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Archive } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { editOrg } from '../../../services/orgs';
import ArchiveConfirm from './ArchiveConfirm';

const useStyles = makeStyles({
    container: {
        width: '100%',
    },
    textField: {
        width: '100%',
    },
    submitButton: {
        minWidth: '10em',
    },
    helperText: {
        color: '#414141'
    },
    archiveButton: {
        color: '#d73a49',
        fontWeight: 'bold',
        borderColor: '#d73a49',
        '&:hover': {
            color: '#FFF',
            backgroundColor: '#d73a49',
        }
    }
});

const DetailsEdit = props => {

    const [name, setName] = useState(props.org.name);
    const [description, setDescription] = useState(props.org.description);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [delOpen, setDelOpen] = useState(false);

    const handleSubmit = () => {
        setSuccess('');
        if (name.length < 1) {
            setError('Please enter the organization name.');
            return;
        }
        if (name !== props.org.name && props.user.orgs.some(o => o.name === name)) {
            setError('You already have an organization with that name.');
            return;
        }
        setLoading(true);
        editOrg({
            token: props.user.token,
            id: props.org.id,
            name,
            description,
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                setSuccess('Your changes have been saved.');
                var oldUser = props.user;
                oldUser.orgs[props.user.orgs.findIndex(o => o.id === props.org.id)] = data;
                props.setUser({ ...oldUser, orgs: [...oldUser.orgs] });
            }
        });
    };

    const classes = useStyles();
    return (
        <>
            View and edit your Voluntime organization here.
            <br /><br />
            <Typography variant='h6'>
                Public Information
            </Typography><br />
            <TextField variant='outlined' label='Name' required onChange={e => setName(e.target.value)} defaultValue={props.org.name} className={classes.textField} /><br /><br />
            <TextField variant='outlined' label='Description' multiline rows={4} onChange={e => setDescription(e.target.value)} defaultValue={props.org.description} className={classes.textField} /><br /><br />
            <br />
            <Grid container justify="flex-end">
                <Button variant='contained' color='primary' disabled={loading} onClick={handleSubmit} className={classes.submitButton}>
                    {
                        loading
                            ? <CircularProgress size={24} color='secondary' />
                            : 'Save Changes'
                    }
                </Button>
            </Grid>
            {
                success.length > 0 &&
                <Alert severity="success">{success}</Alert>
            }
            {
                error.length > 0 &&
                <Alert severity="error">{error}</Alert>
            }
            <br /><br /><br />
            <Grid container justify='center'>
                <Button variant='outlined' onClick={() => setDelOpen(true)} startIcon={<Archive />} className={classes.archiveButton}>ARCHIVE ORGANIZATION</Button>
            </Grid>
            <ArchiveConfirm open={delOpen} setOpen={setDelOpen} user={props.user} setUser={props.setUser} org={props.org} />
        </>
    );
};

export default DetailsEdit;