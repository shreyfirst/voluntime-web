import { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, useMediaQuery } from '@material-ui/core';
import { KeyboardArrowDown as OpenMenuIcon } from '@material-ui/icons';
import { ResponsiveCalendar } from '@nivo/calendar';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const currentYear = new Date().getFullYear();
let years = [];
for (let i = 2018; i <= currentYear; ++i) {
    years.push(i);
}

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        [theme.breakpoints.up('md')]: {
            height: 300,
        },
        [theme.breakpoints.down('sm')]: {
            height: 1400
        },
    }
}));

const YearMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const close = () => setAnchorEl(null);

    const handleSelect = to => {
        props.setYear(to);
        close();
    };

    return (
        <>
            <Button variant='outlined' onClick={handleClick} endIcon={<OpenMenuIcon />}>
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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        let newParsedLogs = [];

        props.logs.forEach(log => {
            if (log.status === 'approved') {
                const logDay = log.end.split('T')[0];
                if (newParsedLogs.length > 0 && newParsedLogs[newParsedLogs.length - 1].day === logDay) {
                    newParsedLogs[newParsedLogs.length - 1].value += log.hours;
                } else {
                    newParsedLogs.push({ day: logDay, value: log.hours });
                }
            }
        });

        setParsedLogs(newParsedLogs);
    }, [props.logs]);

    const classes = useStyles({ isMobile });
    return (
        <div className={classes.container}>
            <YearMenu year={year} setYear={setYear} />
            {
                parsedLogs !== null &&
                <ResponsiveCalendar
                    data={parsedLogs}
                    from={`${year}-01-02`}
                    to={`${year}-12-31`}
                    direction={isMobile ? 'vertical' : 'horizontal'}
                    emptyColor='#eeeeee'
                    colors={['#9be9a8', '#40c463', '#30a14e', '#216e39']} //github colors
                    margin={{ top: -10, right: 0, bottom: 0, left: 0 }}
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