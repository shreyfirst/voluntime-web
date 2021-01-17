import { useState, useEffect } from 'react';
import { Grid, TextField, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { Alarm } from '@material-ui/icons';
import DayjsUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import { Typography } from '@material-ui/core';
import { addLog } from '../../../services/logs';

const useStyles = makeStyles({
    datePicker: {
        marginRight: 20,
    },
    textField: {
        width: '100%'
    },
    submitButton: {
        minWidth: '10em',
    }
});

const AddHours = props => {
    const [start, setStart] = useState(() => dayjs().subtract(1, 'hour'));
    const [end, setEnd] = useState(() => dayjs());
    const [hours, setHours] = useState(1);
    const [description, setDescription] = useState('');

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
        if (val !== 'success') { setError(val); }
        setHours(Math.floor(end.diff(start, 'hour', true) * 100) / 100);
    }, [start, end]);

    const handleSubmit = () => {
        const val = validate();
        if (val !== 'success') { setError(val); return; }
        setLoading(true);
        addLog({
            token: props.user.token,
            id: props.org.id,
            start: start.format('YYYY-MM-DDTHH:mm:ss'),
            end: end.format('YYYY-MM-DDTHH:mm:ss'),
            hours,
            description
        }, (err, data) => {
            setLoading(false);
            if (err) {
                setError(data.message);
            } else {
                setSuccess(`Success! Your hours ${data.status === 'approved' ? 'have been added' : 'are now pending approval'}.`);
            }
        });
    };

    const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={12} sm={9} lg={6}>
                <Typography>
                    Log some volunteer hours.
                </Typography><br />
                <MuiPickersUtilsProvider utils={DayjsUtils}>
                    <KeyboardDatePicker
                        format="ddd, MMM D YYYY"
                        margin="normal"
                        label="Start date"
                        value={start}
                        onChange={date => setStart(date)}
                        InputProps={{ readOnly: true }}
                        className={classes.datePicker}
                    />
                    <KeyboardTimePicker
                        margin="normal"
                        label="Start time"
                        value={start}
                        onChange={date => setStart(date)}
                        InputProps={{ readOnly: true }}
                        keyboardIcon={<Alarm />}
                    /><br /><br />
                    <KeyboardDatePicker
                        format="ddd, MMM D YYYY"
                        margin="normal"
                        label="End date"
                        value={end}
                        onChange={date => setEnd(date)}
                        InputProps={{ readOnly: true }}
                        className={classes.datePicker}
                    />
                    <KeyboardTimePicker
                        margin="normal"
                        label="End time"
                        value={end}
                        onChange={date => setEnd(date)}
                        InputProps={{ readOnly: true }}
                        keyboardIcon={<Alarm />}
                    />
                </MuiPickersUtilsProvider><br /><br />
                Number of hours: <strong>{hours}</strong><br /><br />
                <TextField variant='outlined' label='Activity description' multiline rows={4} onChange={e => setDescription(e.target.value)} InputProps={{ placeholder: 'What did you do for these hours? This helps administrators approve your hours.' }} className={classes.textField} />
                <br /><br />
                <Grid container justify="flex-end">
                    <Button variant='contained' color='primary' disabled={loading || success} onClick={handleSubmit} className={classes.submitButton}>
                        {
                            loading
                                ? <CircularProgress size={24} color='secondary' />
                                : 'Submit Hours'
                        }
                    </Button>
                </Grid>
                {
                    error.length > 0 &&
                    <Alert severity="error">{error}</Alert>
                }
                {
                    success.length > 0 &&
                    <Alert severity="success">{success}</Alert>
                }
            </Grid>
        </Grid>
    );
};

export default AddHours;