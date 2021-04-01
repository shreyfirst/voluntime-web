import { useState, useEffect } from 'react';
import { Button, Grid, Typography, Menu, MenuItem } from '@material-ui/core';
import { DateRange as RangeIcon, KeyboardArrowDown as OpenMenuIcon } from '@material-ui/icons';
import CustomPicker from './CustomPicker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const range = (name, start, end) => ({
    name,
    start: dayjs(start),
    end: dayjs(end)
});

const year = new Date().getFullYear();
const afterJune = dayjs().diff(`${year}-06-01`) > 0;

const ranges = [
    range('This Year', `${year}-01-01`, `${year}-12-31`),
    range('Last Year', `${year - 1}-01-01`, `${year - 1}-12-31`),
    range('This School Year', `${afterJune ? year : year - 1}-06-01`, `${afterJune ? year + 1 : year}-06-01`),
    { name: 'All Time' },
    { name: 'Custom' }];

const savedStart = localStorage.getItem('totals-start');
const savedEnd = localStorage.getItem('totals-end');
const savedName = localStorage.getItem('totals-name');


const RangeMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [customOpen, setCustomOpen] = useState(false);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const close = () => setAnchorEl(null);

    const handleSelect = to => {
        if (to.name === 'Custom') {
            //open range picker, close() from there
            setCustomOpen(true);
        } else {
            props.setName(to.name);
            if (to.name !== 'All Time') {
                props.setStart(to.start);
                props.setEnd(to.end);
            }
            close();
        }
    };

    return (
        <>
            <Button variant='outlined' onClick={handleClick} startIcon={<RangeIcon />} endIcon={<OpenMenuIcon />}>
                {props.name}
            </Button>
            {
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={anchorEl !== null}
                    onClose={close}
                >
                    {
                        ranges.map(r => <MenuItem key={r.name} onClick={() => handleSelect(r)}>{r.name}</MenuItem>)
                    }
                </Menu>
            }
            <CustomPicker open={customOpen} setOpen={setCustomOpen} start={props.start} end={props.end} setStart={props.setStart} setEnd={props.setEnd} setName={props.setName} closeMenu={close} />
        </>
    );
};


const Totals = props => {

    const [start, setStart] = useState(savedStart === null ? ranges[0].start : dayjs(savedStart));
    const [end, setEnd] = useState(savedEnd === null ? ranges[0].end : dayjs(savedEnd));
    const [name, setName] = useState(savedName === null ? ranges[0].name : savedName);

    const [total, setTotal] = useState(0);

    const calculateTotal = () => {
        let sum = 0;
        let found = false;
        for (const log of props.logs) {
            const between = name === 'All Time' || dayjs(log.end).isBetween(start, end, 'day', '[]');

            if (between) {
                found = true;
                if (log.status === 'approved') {
                    sum += log.hours;
                }
            } else {
                if (found) {
                    break;
                }
            }
        }
        return sum;
    };

    useEffect(() => {
        setTotal(calculateTotal());
        localStorage.setItem('totals-name', name);
        localStorage.setItem('totals-start', start);
        localStorage.setItem('totals-end', end);
    }, [start, end, name]);

    return (
        <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12}>
                <RangeMenu start={start} end={end} setStart={setStart} setEnd={setEnd} name={name} setName={setName} /><br />
                {name !== 'All Time' &&
                    <>
                        <br />
                        {start.format('MMM DD, YYYY')} to {end.format('MMM DD, YYYY')}
                    </>
                }
            </Grid>
            <Grid item>
                <Typography variant='h4'><strong>{total.toFixed(1)} hours</strong></Typography>
            </Grid>
        </Grid>
    );
};

export default Totals;