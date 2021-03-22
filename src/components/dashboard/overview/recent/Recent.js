import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import LogRow from './LogRow';

const Recent = props => (
    props.logs.length > 0
        ? <TableContainer>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>Hours</TableCell>
                        <TableCell>Organization</TableCell>
                        <TableCell>When</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.logs.slice(0, 5).map(log =>
                        <LogRow key={log.id} log={log} />
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        : 'None'
);

export default Recent;