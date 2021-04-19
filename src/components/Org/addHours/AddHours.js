import { useState, useEffect, useRef } from 'react';
import { Grid, TextField, Button, Typography, InputAdornment, IconButton, Switch } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import { Alarm as TimeIcon, Event as DateIcon, PlaylistAdd as SubmitIcon } from '@material-ui/icons';
import CircularProgressButton from '../../helpers/CircularProgressButton';
import ImagePreview from '../../helpers/ImagePreview';
import LinearProgressWithLabel from '../../helpers/LinearProgressWithLabel';
import DayjsUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import { addLog } from '../../../services/logs';

const useStyles = makeStyles({
    datePicker: {
        marginRight: 20,
    },
    textField: {
        width: '100%'
    }
});

const cancelEvent = event => {
    event.stopPropagation();
    event.preventDefault();
};

const AddHours = props => {

    const [compressProgress, setCompressProgress] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [fileName, setFileName] = useState(null);

    const fileInputRef = useRef(null);

    const [start, setStart] = useState(() => dayjs().subtract(1, 'hour'));
    const [end, setEnd] = useState(() => dayjs());
    const [hours, setHours] = useState(1);
    const [calcHours, setCalcHours] = useState(true);
    const [description, setDescription] = useState('');
    const [encodedImage, setEncodedImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validate = () => {
        if (start === null || end === null) {
            return 'Invalid time selected';
        }
        if (start.isAfter(end)) {
            return 'The start time must be before the end time.';
        }
        setError('');
        return 'success';
    };

    useEffect(() => {
        const val = validate();
        if (val !== 'success') { setSuccess(''); setError(val); }
        setHours(Math.floor(end.diff(start, 'hour', true) * 100) / 100);
    }, [start, end]);

    const handleSubmit = () => {
        const val = validate();
        if (val !== 'success') { setSuccess(''); setError(val); return; }
        setLoading(true);
        setUploadProgress(0);
        addLog({
            token: props.user.token,
            id: props.org.id,
            start: start.format('YYYY-MM-DDTHH:mm:ss'),
            end: end.format('YYYY-MM-DDTHH:mm:ss'),
            hours,
            description,
            image: encodedImage === null ? '' : encodedImage
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setSuccess('');
                setError(data.message);
            } else {
                setError('');
                setDescription('');
                setCompressProgress(null);
                setUploadProgress(null);
                fileInputRef.current.value = '';
                setSuccess(`Success! Your hours ${data.status === 'approved' ? 'have been added' : 'are now pending approval'}.`);
            }
        }, encodedImage !== null && setUploadProgress);
    };

    useEffect(() => {
        if (calcHours) {
            const h = Math.floor(end.diff(start, 'hour', true) * 100) / 100;
            setHours(h < 0 ? 0 : h);
        }
    }, [calcHours, start, end]);

    const classes = useStyles();
    return (
        <Grid container onDragOver={cancelEvent} onDrop={cancelEvent}>
            <Grid item xs={12} sm={9} lg={6}>
                <Typography>
                    Log some volunteer hours.
                </Typography><br />
                <MuiPickersUtilsProvider utils={DayjsUtils}>
                    <DatePicker
                        format='ddd, MMM D, YYYY'
                        margin='normal'
                        label='Start date'
                        value={start}
                        onChange={setStart}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton>
                                        <DateIcon />
                                    </IconButton>
                                </InputAdornment>
                            ), readOnly: true
                        }}
                        className={classes.datePicker}
                    />
                    <TimePicker
                        margin='normal'
                        label='Start time'
                        value={start}
                        onChange={setStart}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton>
                                        <TimeIcon />
                                    </IconButton>
                                </InputAdornment>
                            ), readOnly: true
                        }}
                    /><br /><br />
                    <DatePicker
                        minDate={start}
                        format='ddd, MMM D, YYYY'
                        margin='normal'
                        label='End date'
                        value={end}
                        onChange={setEnd}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton>
                                        <DateIcon />
                                    </IconButton>
                                </InputAdornment>
                            ), readOnly: true
                        }}
                        className={classes.datePicker}
                    />
                    <TimePicker
                        margin='normal'
                        label='End time'
                        value={end}
                        onChange={setEnd}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton>
                                        <TimeIcon />
                                    </IconButton>
                                </InputAdornment>
                            ), readOnly: true
                        }}
                    />
                </MuiPickersUtilsProvider><br /><br />
                <TextField type='number' onChange={e => {
                    if (e.target.value.toString().length <= 4) {
                        setCalcHours(false);
                        setHours(e.target.value);
                    }
                }} onBlur={() => {
                    if (hours.length < 1 || hours < 0) {
                        setHours(0);
                    }
                }} variant='outlined' label='Volunteer hours' InputProps={{
                    placeholder: '0',
                }} inputProps={{
                    min: 0,
                    max: 9999
                }} value={hours} fullWidth /><br />

                Auto-calculate hours: <Switch
                    checked={calcHours}
                    onChange={() => setCalcHours(!calcHours)}
                    color='primary'
                    className={classes.switch} /><br /><br />
                <TextField variant='outlined' label='Activity description' multiline rows={4} value={description} onChange={e => setDescription(e.target.value)} inputProps={{ maxLength: 5000 }} InputProps={{ placeholder: 'What did you do for these hours? This helps administrators approve your hours.' }} className={classes.textField} />
                <br /><br />
                <Typography>Attach Image (optional):</Typography>
                <ImagePreview src={encodedImage === null ? '' : encodedImage} fileInputRef={fileInputRef} setSuccess={setSuccess} setError={setError} fileName={fileName} setFileName={setFileName} progress={compressProgress} onProgress={setCompressProgress} onFinish={setEncodedImage} />
                <br /><br />
                <Grid container justify='flex-end'>
                    <Button variant='contained' color='primary' disabled={loading || success.length > 0} onClick={handleSubmit} startIcon={loading ? <CircularProgressButton /> : <SubmitIcon />}>
                        Submit Hours
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
                    error.length > 0 &&
                    <Alert severity='error'>{error}</Alert>
                }
                {
                    success.length > 0 &&
                    <Alert severity='success'>{success}</Alert>
                }
            </Grid>
        </Grid>
    );
};

export default AddHours;