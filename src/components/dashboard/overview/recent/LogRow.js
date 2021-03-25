import { TableCell, TableRow } from '@material-ui/core';
import { Check as ApprovedIcon, Clear as DeniedIcon, Schedule as PendingIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

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
    }
}));

const StatusIcon = ({ status, ...props }) => {
    const classes = useStyles();

    switch (status) {
        case 'approved': return <ApprovedIcon className={classes[status]} {...props} />;
        case 'pending': return <PendingIcon className={classes[status]} {...props} />;
        case 'denied': return <DeniedIcon className={classes[status]} {...props} />;
    }
};

const LogRow = props => {
    const log = props.log;

    const classes = useStyles();
    return (
        <>
            <TableRow className={classes.row}>
                <TableCell>
                    <StatusIcon status={log.status} />
                </TableCell>
                <TableCell>{log.hours}</TableCell>
                <TableCell>{log.org.name.length > 30 ? log.org.name.substring(0, 29) + '...' : log.org.name}</TableCell>
                <TableCell>{dayjs(log.end).fromNow()}</TableCell>
            </TableRow>
        </>
    );
};

export default LogRow;