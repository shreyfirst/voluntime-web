import { useState } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { Add as DropIcon, Image as UploadIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import imageCompression from 'browser-image-compression';


const useStyles = makeStyles({
    imagePreviewContainer: props => ({
        width: props.width,
        height: props.height,
        outline: '2px dashed gray',
        backgroundColor: '#FAFAFA',
        overflow: 'hidden',
    }),
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

    const handleImageUpload = files => {
        if (files.length < 1) { return; }

        const file = files[0];

        if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
            props.setSuccess('');
            props.setError('Please choose a PNG or JPEG file.');
            return;
        }

        props.setFileName(file.name);

        imageCompression(file, {
            maxSizeMB: props.maxWidthOrHeight === undefined ? 0.1 : undefined,
            maxWidthOrHeight: props.maxWidthOrHeight,
            useWebWorker: true,
            onProgress: props.onProgress,
        })
            .then(compressedFile =>
                imageCompression.getDataUrlFromFile(compressedFile)
                    .then(props.onFinish)
                    .catch(err => {
                        console.error(err);
                        props.setSuccess('');
                        props.setError('An error occurred while encoding the image. Please try again or choose a different image.');
                    })
            )
            .catch(err => {
                console.error(err);
                props.setSuccess('');
                props.setError('An error occurred while compressing the image. Please try again or choose a different image.');
            });
    };

    const dragHandler = event => {
        setFileHover(true);
        cancelEvent(event);
    };

    const dropHandler = event => {
        setFileHover(false);
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

    const classes = useStyles({ width: props.width, height: props.height === undefined ? 150 : props.height });
    return (
        <>
            <Grid container justify='center' alignItems='center' className={`${classes.imagePreviewContainer} ${fileHover && classes.fileHover}`} onDrop={dropHandler} onDragOver={dragHandler} onDragLeave={() => setFileHover(false)}>
                {
                    props.src?.length > 0
                        ? <img src={props.src} height={props.maxWidthOrHeight === undefined ? 150 : 75} width={props.maxWidthOrHeight === undefined ? undefined : 75 } alt='' />
                        : <Typography>
                            {
                                fileHover
                                    ? <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                    }}><DropIcon /> Drop Image</div>
                                    : props.progress === null
                                        ? props.placeholder === undefined ? 'No Image Selected' : props.placeholder
                                        : 'Compressing Image...'
                            }
                        </Typography>
                }
            </Grid>
            <br />
            <Button variant='outlined' component='label' disabled={props.progress !== null && props.progress < 100} startIcon={<UploadIcon />}>
                Select Image
                <input
                    type='file'
                    hidden
                    accept='image/png, image/jpeg'
                    onChange={event => handleImageUpload(event.target.files)}
                    ref={props.fileInputRef}
                />
            </Button>
            {props.fileName !== null && <span style={{ marginLeft: 15 }}>{props.fileName}</span>}
            <br /><br />
            {
                props.progress !== null && props.progress < 100 &&
                <>
                    Compressing Image:<br />
                    <LinearProgressWithLabel value={props.progress} />
                </>
            }
        </>
    );
};

export default ImagePreview;