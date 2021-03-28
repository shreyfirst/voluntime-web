import { useState } from 'react';
import { Grid, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

const CustomPicker = props => {

    const [start, setStart] = useState(props.start);
    const [end, setEnd] = useState(props.end);

    const closeDialog = () => props.setOpen(false);

    const handleSubmit = () => {
        props.setName('Custom');
        props.setStart(start);
        props.setEnd(end);
        props.closeMenu();
        closeDialog();
    };

    return (
        <Dialog open={props.open} onClose={closeDialog} fullWidth maxWidth='md'>
            <DialogTitle>Choose Time Range</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Select a start and end date to calculate your total hours.
                </DialogContentText>
                <MuiPickersUtilsProvider utils={DayjsUtils}>
                    <Grid container spacing={3} justify='space-evenly'>
                        <Grid item align='center'>
                            <Typography variant='h6'><strong>Start</strong></Typography>
                            <KeyboardDatePicker
                                label='Start date'
                                value={start}
                                onChange={setStart}
                                variant='static'
                            />
                        </Grid>
                        <Grid item align='center'>
                            <Typography variant='h6'><strong>End</strong></Typography>
                            <KeyboardDatePicker
                                minDate={start}
                                label='End date'
                                value={end}
                                onChange={setEnd}
                                variant='static'
                            />
                        </Grid>
                    </Grid>
                </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={closeDialog}>
                    Cancel
                </Button>
                <Button variant='contained' onClick={handleSubmit} color='primary'>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomPicker;