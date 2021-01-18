import { useState, memo } from 'react';
import { Box, TableCell, TableRow, IconButton, Collapse, Button, CircularProgress } from '@material-ui/core';
import { Check as ApprovedIcon, Clear as DeniedIcon, Schedule as PendingIcon, KeyboardArrowDown as DownArrow, KeyboardArrowUp as UpArrow } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import { editStatus } from '../../../services/logs';

const useStyles = makeStyles(theme => ({
    row: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    approved: {
        color: theme.palette.success.main,
        borderColor: theme.palette.success.main
    },
    pending: {
        color: theme.palette.warning.main
    },
    denied: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main
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
    },
    button: {
        marginLeft: 15,
    },
    editStatusIcons: {
        position: 'relative',
        right: 10,
    },
    editStatusIcon: {
        padding: 0,
    }
}));

const LogRow = memo(props => {
    const log = props.log;
    const [open, setOpen] = useState(false);
    const [pendingHover, setPendingHover] = useState(false);
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [loadingDeny, setLoadingDeny] = useState(false);
    const [error, setError] = useState('');

    const classes = useStyles();
    const StatusIcon = ({ status, ...props }) => {
        switch (status) {
            case 'approved': return <ApprovedIcon className={classes[status]} {...props} />
            case 'pending': return <PendingIcon className={classes[status]} {...props} />
            case 'denied': return <DeniedIcon className={classes[status]} {...props} />
        }
    };

    const changeStatus = to => {
        to === 'approved' ? setLoadingApprove(true) : setLoadingDeny(true);
        editStatus({
            token: props.user.token,
            id: log.id,
            status: to,
        }, (err, data) => {
            to === 'approved' ? setLoadingApprove(false) : setLoadingDeny(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                var newLogs = [...props.allLogs];
                newLogs[newLogs.findIndex(l => l.id === data.id)] = ({ ...data, vol: props.members.find(m => m.id === data.userId), ...(data.status !== 'pending' && { approverInfo: props.members.find(m => m.id === data.approver) }) });
                props.setLogs(newLogs);
            }
        });
    };

    const setHover = to => {
        if (log.status === 'pending') {
            setPendingHover(to);
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
                <TableCell onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    {
                        props.org.role !== 'vol' && log.status === 'pending' && pendingHover
                            ? <span className={classes.editStatusIcons}>
                                <IconButton disabled={loadingApprove || loadingDeny} onClick={() => changeStatus('approved')} className={classes.editStatusIcon}><StatusIcon status='approved' /></IconButton>
                                <IconButton disabled={loadingApprove || loadingDeny} onClick={() => changeStatus('denied')} className={classes.editStatusIcon}><StatusIcon status='denied' /></IconButton>
                            </span>
                            : <StatusIcon status={log.status} />
                    }
                </TableCell>
                <TableCell>{log.hours}</TableCell>
                <TableCell>{log.vol.firstName} {log.vol.lastName}</TableCell>
                <TableCell>{log.status !== 'pending' ? `${log.approverInfo.firstName} ${log.approverInfo.lastName}` : '-'}</TableCell>
                <TableCell><span className={classes.date}>{start.format('YYYY-MM-DD')}</span> {start.format('hh:mm A')}</TableCell>
                <TableCell><span className={classes.date}>{end.format('YYYY-MM-DD')}</span> {end.format('hh:mm A')}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, }} colSpan={7}>
                    <Collapse in={open} timeout="auto">
                        <div className={classes.collapse}>
                            <strong>Volunteer:</strong> {log.vol.firstName} {log.vol.lastName}<br /><br />
                            <span className={classes.collapseTimeLabel}>Start Time:</span> <Box fontFamily='Monospace' fontSize={15} letterSpacing={0.8} component='span'>{start.format('ddd, MMM D YYYY [at] hh:mm A')}</Box><br />
                            <span className={classes.collapseTimeLabel}>End Time:</span> <Box fontFamily='Monospace' fontSize={15} letterSpacing={0.8} component='span'>{end.format('ddd, MMM D YYYY [at] hh:mm A')}</Box><br /><br />
                            <strong>Hours:</strong> {log.hours}
                            {
                                props.org.role !== 'vol' && log.status === 'pending' &&
                                <>
                                    <Button variant='outlined' color='primary' disabled={loadingApprove || loadingDeny} onClick={() => changeStatus('approved')} startIcon={<StatusIcon status='approved' />} className={`${classes.button} ${classes.approved}`}>
                                        {
                                            loadingApprove
                                                ? <CircularProgress size={24} color='secondary' />
                                                : 'Approve'
                                        }
                                    </Button>
                                    <Button variant='outlined' color='primary' disabled={loadingApprove || loadingDeny} onClick={() => changeStatus('denied')} startIcon={<StatusIcon status='denied' />} className={`${classes.button} ${classes.denied}`}>
                                        {
                                            loadingDeny
                                                ? <CircularProgress size={24} color='secondary' />
                                                : 'Deny'
                                        }
                                    </Button>
                                </>
                            }
                            <br /><br />
                            <strong>Activity Description:</strong> <div className={classes.description}>{log.description.length > 0 ? log.description : <em>No description provided</em>}</div><br />
                            {
                                error.length > 0 &&
                                <Alert severity="error">{error}</Alert>
                            }
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
});

export default LogRow;