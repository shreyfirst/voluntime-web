import { useState, useEffect } from 'react';
import { Menu, MenuItem, Button } from '@material-ui/core';
import { DateRange as RangeIcon, KeyboardArrowDown as OpenMenuIcon } from '@material-ui/icons';
import Member from './Member';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(quarterOfYear)

const now = dayjs();


const RangeMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => setAnchorEl(event.currentTarget);
    const close = () => setAnchorEl(null);

    const setRange = range => {
        props.setRange(range);
        close();
    };

    return (
        <>
            <Button variant='outlined' startIcon={<RangeIcon />} endIcon={<OpenMenuIcon />} onClick={handleClick}>
                {props.range}
            </Button>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={close}
            >
                <MenuItem onClick={() => setRange('week')}>Week</MenuItem>
                <MenuItem onClick={() => setRange('month')}>Month</MenuItem>
                <MenuItem onClick={() => setRange('quarter')}>Quarter</MenuItem>
                <MenuItem onClick={() => setRange('year')}>Year</MenuItem>
            </Menu>
        </>
    );
};

const TopMember = props => {
    const members = props.members;
    const logs = props.logs;
    const [top, setTop] = useState(null);
    const [range, setRange] = useState('month');
    const [found, setFound] = useState(true);

    const calculateTop = () => {
        const memberHours = {};

        let memberFound = false;
        logs.forEach(l => {
            if (l.status === 'approved' && now.isSame(l.end, range)) {
                if (memberHours[l.userId] === undefined) {
                    memberHours[l.userId] = l.hours;
                } else {
                    memberHours[l.userId] += l.hours;
                }
                memberFound = true;
            }
        });

        if (!memberFound) {
            setFound(false);
            return;
        }

        const topId = Object.keys(memberHours).reduce((a, b) => memberHours[a] > memberHours[b] ? a : b, null);

        setTop(members.find(m => m.id === topId));
        setFound(true);
    };

    useEffect(calculateTop, [range]);

    return (
        <>
            {
                found
                    ? top === null
                        ? 'Calculating...'
                        : <>
                            <RangeMenu range={range} setRange={setRange} />
                            <Member member={top} />
                        </>
                    : 'None'

            }
        </>
    );
};

export default TopMember;