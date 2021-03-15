import { useState, useEffect } from 'react';
import { Button, Typography, Menu, MenuItem } from '@material-ui/core';
import { KeyboardArrowDown as OpenMenuIcon } from '@material-ui/icons';
import { ResponsiveCalendar } from '@nivo/calendar';
import { makeStyles } from '@material-ui/core/styles';

const currentYear = new Date().getFullYear();
var years = [];
for (var i = 2018; i <= currentYear; ++i) {
    years.push(i);
}
console.log(years);

const useStyles = makeStyles({
    container: {
        width: '100%',
        height: 300
    },
    filterMenu: {
        marginLeft: 15,
    },
});

const YearMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const close = () => setAnchorEl(null);

    const handleSelect = to => {
        props.setYear(to);
        close();
    };

    const classes = useStyles();
    return (
        <>
            <Button variant='outlined' onClick={handleClick} endIcon={<OpenMenuIcon />} className={classes.filterMenu}>
                {props.year}
            </Button>
            {
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={anchorEl !== null}
                    onClose={close}
                >
                    {
                        years.map(y => <MenuItem key={y.toString()} onClick={() => handleSelect(y)}>{y}</MenuItem>)
                    }
                </Menu>
            }
        </>
    );
};


const Heatmap = props => {
    const [parsedLogs, setParsedLogs] = useState(null);
    const [year, setYear] = useState(currentYear);

    useEffect(() => {
        var newParsedLogs = [];

        props.logs.forEach((log, index) => {
            const logDay = log.start.split('T')[0];
            if (index > 0 && newParsedLogs[newParsedLogs.length - 1].day === logDay) {
                newParsedLogs[newParsedLogs.length - 1].value += log.hours;
            } else {
                newParsedLogs.push({ day: logDay, value: log.hours });
            }
        });

        setParsedLogs(newParsedLogs);
    }, [props.logs]);

    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Typography component='span'>
                Year:
            </Typography>
            <YearMenu year={year} setYear={setYear} /><br />
            {
                parsedLogs !== null &&
                <ResponsiveCalendar
                    data={parsedLogs}
                    from={`${year}-02-01`}
                    to={`${year}-11-31`}
                    emptyColor='#eeeeee'
                    colors={['#9be9a8', '#40c463', '#30a14e', '#216e39']} //github colors
                    margin={{ top: 0, right: 0, bottom: 40, left: 0 }}
                    yearSpacing={40}
                    monthBorderColor='#fff'
                    monthBorderWidth={5}
                    dayBorderWidth={2}
                    dayBorderColor='#ffffff'
                />
            }
        </div>
    );
};

export default Heatmap;