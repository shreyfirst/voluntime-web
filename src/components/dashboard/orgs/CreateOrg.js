import { useState } from 'react';
import { Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack } from '@material-ui/icons';
import { createOrg } from '../../../services';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles({
    container: {
        width: '50%'
    },
    textField: {
        width: '100%',
        maxWidth: '32em'
    },
    button: {
        minWidth: '12em',
    }
});

const CreateOrg = props => {

    const history = useHistory();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (name.length < 1) {
            setError('Please enter a name for your organization.');
            return;
        }
        for (let org of props.user.orgs) {
            if (org.name.toLowerCase() === name.toLowerCase()) {
                setError('You already have an organization with that name.');
                return;
            }
        }
        setLoading(true);
        createOrg({
            token: props.user.token,
            name,
            description
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                var newUser = props.user;
                newUser.orgs.push(data);
                props.setUser(newUser);
                history.push(`/dashboard/${data.id}`);
            }
        });
    };

    const keyPress = event => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Button variant='outlined' startIcon={<ArrowBack />} onClick={() => props.setView('orgs')}>Back</Button>
            <br /><br />
            <Typography variant='h6'>Create Organization</Typography><br />
            <Typography variant='body2'>
                Create an organization to start logging hours for your volunteers.<br />
                You may add additional information to your organization by editing it after it's created.
            </Typography><br />
            <TextField onKeyDown={keyPress} onChange={e => setName(e.target.value)} variant='outlined' label='Organization Name' required className={classes.textField} /><br /><br />
            <TextField onKeyDown={keyPress} onChange={e => setDescription(e.target.value)} variant='outlined' label='Description' multiline rows={4} className={classes.textField} /><br /><br />
            <Button variant='contained' color='primary' disabled={loading} onClick={handleSubmit} className={classes.button}>
                {
                    loading
                        ? <CircularProgress size={24} color='secondary' />
                        : 'Create Organization'
                }
            </Button>
            <br />
            {
                error.length > 0 &&
                <Alert severity="error">{error}</Alert>
            }
        </div>
    );
};

export default CreateOrg;