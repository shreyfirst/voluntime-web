import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse } from '@material-ui/core';
import { Check as ApprovedIcon, Clear as DeniedIcon, Schedule as PendingIcon, KeyboardArrowDown as DownArrow, KeyboardArrowUp as UpArrow } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

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
                <TableCell>{log.start}</TableCell>
                <TableCell>{log.end}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        collapse
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const TableView = props => (
    <TableContainer>
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
);

export default TableView;