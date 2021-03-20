import { useState, useEffect } from 'react';
import { Button, Typography, Menu, MenuItem } from '@material-ui/core';
import { KeyboardArrowDown as OpenMenuIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles({
    filterMenu: {
        marginLeft: 15,
    }
});

const RangeMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const close = () => setAnchorEl(null);

    const handleSelect = to => {
        props.setName(to.name);
        if (to.name !== 'All Time') {
            if (to.name === 'Custom') {
                //open range picker
            } else {
                props.setStart(to.start);
                props.setEnd(to.end);
            }
        }
        close();
    };

    const classes = useStyles();
    return (
        <>
            <Button variant='outlined' onClick={handleClick} endIcon={<OpenMenuIcon />} className={classes.filterMenu}>
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
        </>
    );
};


const Totals = props => {

    const [start, setStart] = useState(savedStart === null ? ranges[0].start : dayjs(savedStart));
    const [end, setEnd] = useState(savedEnd === null ? ranges[0].end : dayjs(savedEnd));
    const [name, setName] = useState(savedName === null ? ranges[0].name : savedName);

    const [total, setTotal] = useState(0);

    const calculateTotal = () => {
        return props.logs.reduce((sum, log) => {
            if (log.status === 'approved' && (name === 'All Time' || dayjs(log.end).isBetween(start, end))) {
                return sum + log.hours;
            }
            return sum;
        }, 0);
    };

    useEffect(() => setTotal(calculateTotal()), [start, end, name]);

    return (
        <div>
            <RangeMenu setStart={setStart} setEnd={setEnd} name={name} setName={setName} /><br />
            Start: {start.format('YYYY-MM-DD')}<br />
            End: {end.format('YYYY-MM-DD')}<br />
            <strong>Total: {total}</strong>
        </div>
    );
};

export default Totals;