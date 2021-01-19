import { useState, useRef } from 'react';
import { Typography, TextField, Grid, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Archive, Image as UploadIcon, Save as SaveIcon, PanTool as DropIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { editOrg } from '../../../services/orgs';
import ArchiveConfirm from './ArchiveConfirm';
import LinearProgressWithLabel from '../../helpers/LinearProgressWithLabel';
import imageCompression from 'browser-image-compression';

const useStyles = makeStyles({
    container: {
        width: '100%',
    },
    textField: {
        width: '100%',
    },
    submitButton: {
        minWidth: '11em',
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
    },
    imagePreviewContainer: {
        width: 350,
        height: 150,
        outline: '2px dashed gray',
        backgroundColor: '#FAFAFA'
    },
    fileHover: {
        outline: '2px dashed black',
    }
});

const cancelEvent = event => {
    event.stopPropagation();
    event.preventDefault();
};

const ImagePreview = props => {

    const [fileHover, setFileHover] = useState(false);

    const dragHandler = event => {
        setFileHover(true);
        cancelEvent(event);
    };

    const dropHandler = event => {
        setFileHover(false);
        props.dropHandler(event);
    };

    const classes = useStyles();
    return (
        <Grid container justify='center' alignItems='center' className={`${classes.imagePreviewContainer} ${fileHover && classes.fileHover}`} onDrop={dropHandler} onDragOver={dragHandler} onDragLeave={() => setFileHover(false)}>
            {
                props.src?.length > 0
                    ? <img src={props.src} height={150} />
                    : <Typography>
                        {
                            fileHover
                                ? <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}><DropIcon /> &nbsp; Drop Image</div>
                                : 'No Card Image'
                        }
                    </Typography>
            }
        </Grid>
    );
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

    const handleImageUpload = files => {
        if (files.length < 1) { return; }

        const file = files[0];

        if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
            setSuccess('');
            setError('Please choose a PNG or JPEG file.');
            return;
        }

        setFileName(file.name);

        imageCompression(file, {
            maxSizeMB: 0.1,
            useWebWorker: true,
            onProgress: setCompressProgress,
        })
            .then(compressedFile =>
                imageCompression.getDataUrlFromFile(compressedFile)
                    .then(setEncodedImage)
                    .catch(err => { console.error(err); setSuccess(''); setError('An error occurred while encoding the image. Please try again or choose a different image.'); })
            )
            .catch(err => { console.error(err); setSuccess(''); setError('An error occurred while compressing the image. Please try again or choose a different image.'); });
    };

    const dropHandler = event => {
        cancelEvent(event);

        if (event.dataTransfer.items) {
            // If dropped items aren't files, reject them
            if (event.dataTransfer.items.length > 0 && event.dataTransfer.items[0].kind === 'file') {
                handleImageUpload([event.dataTransfer.items[0].getAsFile()]);
            }
        } else {
            handleImageUpload(event.dataTransfer.files);
        }
    };

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
            {
                encodedImage === null
                    ? <ImagePreview src={props.org.imageUrl} dropHandler={dropHandler} />
                    : <ImagePreview src={encodedImage} dropHandler={dropHandler} />
            }
            <br />
            <Button variant='outlined' component='label' disabled={compressProgress !== null && compressProgress < 100} startIcon={<UploadIcon />}>
                Select Image
                <input
                    type='file'
                    hidden
                    accept='image/png, image/jpeg'
                    onChange={event => handleImageUpload(event.target.files)}
                    ref={fileInputRef}
                />
            </Button>
            {fileName !== null && <span style={{ marginLeft: 15 }}>{fileName}</span>}
            <br /><br />
            {
                compressProgress !== null && compressProgress < 100 &&
                <>
                    Compressing Image:<br />
                    <LinearProgressWithLabel value={compressProgress} />
                </>
            }
            <br />
            <TextField variant='outlined' label='Name' required onChange={e => setName(e.target.value)} defaultValue={props.org.name} className={classes.textField} /><br /><br />
            <TextField variant='outlined' label='Description' multiline rows={4} onChange={e => setDescription(e.target.value)} defaultValue={props.org.description} className={classes.textField} /><br /><br />
            <br />
            <Grid container justify="flex-end">
                <Button variant='contained' color='primary' disabled={loading || compressProgress !== null && compressProgress < 100} onClick={handleSubmit} startIcon={!loading && <SaveIcon />} className={classes.submitButton}>
                    {
                        loading
                            ? <CircularProgress size={24} color='secondary' />
                            : 'Save Changes'
                    }
                </Button>
            </Grid>
            {
                loading && uploadProgress !== null &&
                <>
                    Uploading:<br />
                    <LinearProgressWithLabel value={uploadProgress} />
                </>
            }
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
        </div>
    );
};

export default DetailsEdit;