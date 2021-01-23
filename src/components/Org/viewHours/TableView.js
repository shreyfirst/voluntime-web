import { useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import LogRow from './LogRow';

const TableView = props => {

    const updateLogs = useCallback(data => {
        var newLogs = [...props.allLogs];
        newLogs[newLogs.findIndex(l => l.id === data.id)] = ({ ...data, vol: props.members.find(m => m.id === data.userId), ...(data.status !== 'pending' && { approverInfo: props.members.find(m => m.id === data.approver) }) });
        props.setLogs(newLogs);
    }, [props.allLogs, props.members]);

    return (
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
                            <LogRow key={log.id} log={log} token={props.user.token} role={props.org.role} handleResponse={updateLogs} />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            : <Typography variant='h6' style={{ paddingLeft: 25 }}>
                <br />No Results
                </Typography>
    );
};

export default TableView;