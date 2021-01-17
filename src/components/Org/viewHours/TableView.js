import { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse } from '@material-ui/core';
import { Check as ApprovedIcon, Clear as DeniedIcon, Schedule as PendingIcon, KeyboardArrowDown as DownArrow, KeyboardArrowUp as UpArrow } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';

const useStyles = makeStyles(theme => ({
    row: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    approved: {
        color: theme.palette.success.main
    },
    pending: {
        color: theme.palette.warning.main
    },
    denied: {
        color: theme.palette.error.main
    },
    date: {
        color: '#787878'
    },
    collapse: {
        paddingLeft: 15,
        paddingTop: 8,
        paddingBottom: 8,
    },
    collapseTimeLabel: {
        display: 'inline-block',
        minWidth: '10ch',
        fontWeight: 'bold'
    },
    description: {
        maxWidth: '70%',
    }
}));

const Row = props => {
    const log = props.log;
    const [open, setOpen] = useState(false);

    const classes = useStyles();
    const renderStatusIcon = status => {
        switch (status) {
            case 'approved': return <ApprovedIcon className={classes[status]} />
            case 'pending': return <PendingIcon className={classes[status]} />
            case 'denied': return <DeniedIcon className={classes[status]} />
        }
    };

    const start = dayjs(log.start);
    const end = dayjs(log.end);

    return (
        <>
            <TableRow className={classes.row}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <UpArrow /> : <DownArrow />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    {renderStatusIcon(log.status)}
                </TableCell>
                <TableCell>{log.hours}</TableCell>
                <TableCell>{log.vol.firstName} {log.vol.lastName}</TableCell>
                <TableCell>{log.status === 'approved' ? `${log.approverInfo.firstName} ${log.approverInfo.lastName}` : '-'}</TableCell>
                <TableCell><span className={classes.date}>{start.format('YYYY-MM-DD')}</span> {start.format('hh:mm A')}</TableCell>
                <TableCell><span className={classes.date}>{end.format('YYYY-MM-DD')}</span> {end.format('hh:mm A')}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit className={classes.collapse}>
                        <strong>Volunteer:</strong> {log.vol.firstName} {log.vol.lastName}<br /><br />
                        <span className={classes.collapseTimeLabel}>Start Time:</span> <Box fontFamily='Monospace' fontSize={15} letterSpacing={0.8} component='span'>{start.format('ddd, MMM D YYYY [at] hh:mm A')}</Box><br />
                        <span className={classes.collapseTimeLabel}>End Time:</span> <Box fontFamily='Monospace' fontSize={15} letterSpacing={0.8} component='span'>{end.format('ddd, MMM D YYYY [at] hh:mm A')}</Box><br /><br />
                        <strong>Hours:</strong> {log.hours}<br /><br />
                        <strong>Activity Description:</strong> <div className={classes.description}>{log.description.length > 0 ? log.description : <em>No description provided</em>}</div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const TableView = props => (
    <>
        {
            props.logs.length > 0
                ? <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Status</TableCell>
                                <TableCell>Hours</TableCell>
                                <TableCell>Volunteer</TableCell>
                                <TableCell>Approver/Denier</TableCell>
                                <TableCell>Start</TableCell>
                                <TableCell>End</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.logs.map(log =>
                                <Row key={log.id} log={log} user={props.user} org={props.org} />
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                : 'No Results'
        }
    </>

);

export default TableView;