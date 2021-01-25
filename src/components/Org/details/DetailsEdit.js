import { useState, useRef } from 'react';
import { Typography, TextField, Grid, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Archive, Save as SaveIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { editOrg } from '../../../services/orgs';
import ArchiveConfirm from './ArchiveConfirm';
import CircularProgressButton from '../../helpers/CircularProgressButton';
import LinearProgressWithLabel from '../../helpers/LinearProgressWithLabel';
import ImagePreview from '../../helpers/ImagePreview';

const useStyles = makeStyles({
    container: {
        width: '100%',
    },
    textField: {
        width: '100%',
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

const cancelEvent = event => {
    event.stopPropagation();
    event.preventDefault();
};

const DetailsEdit = props => {

    const [compressProgress, setCompressProgress] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [fileName, setFileName] = useState(null);

    const fileInputRef = useRef(null);

    const [name, setName] = useState(props.org.name);
    const [description, setDescription] = useState(props.org.description);
    const [encodedImage, setEncodedImage] = useState(null);

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
        setUploadProgress(0);
        editOrg({
            token: props.user.token,
            id: props.org.id,
            name,
            description,
            image: encodedImage //can be null or base64 string
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                setEncodedImage(null);
                setCompressProgress(null);
                setUploadProgress(null);
                setFileName(null);
                fileInputRef.current.value = '';
                setSuccess('Your changes have been saved.');
                var oldUser = props.user;
                oldUser.orgs[props.user.orgs.findIndex(o => o.id === props.org.id)] = data;
                props.setUser({ ...oldUser, orgs: [...oldUser.orgs] });
            }
        }, encodedImage !== null && setUploadProgress);
    };

    const classes = useStyles();
    return (
        <div onDragOver={cancelEvent} onDrop={cancelEvent}>
            View and edit your Voluntime organization here.
            <br /><br />
            <Typography variant='h6'>
                Public Information
            </Typography><br />
            <ImagePreview src={encodedImage === null ? props.org.image : encodedImage} width={350} fileInputRef={fileInputRef} setSuccess={setSuccess} setError={setError} fileName={fileName} setFileName={setFileName} progress={compressProgress} onProgress={setCompressProgress} onFinish={setEncodedImage} />
            <br />
            <TextField variant='outlined' label='Name' required onChange={e => setName(e.target.value)} defaultValue={props.org.name} className={classes.textField} /><br /><br />
            <TextField variant='outlined' label='Description' multiline rows={4} onChange={e => setDescription(e.target.value)} defaultValue={props.org.description} className={classes.textField} /><br /><br />
            <br />
            <Grid container justify='flex-end'>
                <Button variant='contained' color='primary' disabled={loading || compressProgress !== null && compressProgress < 100} onClick={handleSubmit} startIcon={loading ? <CircularProgressButton /> : <SaveIcon />}>
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
            {
                success.length > 0 &&
                <Alert severity='success'>{success}</Alert>
            }
            {
                error.length > 0 &&
                <Alert severity='error'>{error}</Alert>
            }
            <br /><br /><br />
            <Grid container justify='center'>
                <Button variant='outlined' onClick={() => setDelOpen(true)} startIcon={<Archive />} className={classes.archiveButton}>ARCHIVE ORGANIZATION</Button>
            </Grid>
            <ArchiveConfirm open={delOpen} setOpen={setDelOpen} user={props.user} setUser={props.setUser} org={props.org} />
        </div>
    );
};

export default DetailsEdit;