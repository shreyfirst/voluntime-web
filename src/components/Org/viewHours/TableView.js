import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import LogRow from './LogRow';

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
                                <LogRow key={log.id} log={log} user={props.user} org={props.org} allLogs={props.allLogs} setLogs={props.setLogs} members={props.members} />
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <Typography variant='h6' style={{ paddingLeft: 25 }}>
                    <br />No Results
                </Typography>
        }
    </>
);

export default TableView;