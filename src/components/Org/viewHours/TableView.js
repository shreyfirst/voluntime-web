import { useState, useCallback, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, TablePagination, Typography, IconButton } from '@material-ui/core';
import { KeyboardArrowRight as RightArrow, KeyboardArrowLeft as LeftArrow, LastPage, FirstPage } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import LogRow from './LogRow';

const useStyles = makeStyles(theme => ({
    paginationActions: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    }
}));

const TablePaginationActions = ({ count, page, rowsPerPage, onChangePage }) => {

    const handleFirstPageButtonClick = event => onChangePage(event, 0);

    const handleBackButtonClick = event => onChangePage(event, page - 1);

    const handleNextButtonClick = event => onChangePage(event, page + 1);

    const handleLastPageButtonClick = event => onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

    const classes = useStyles();
    return (
        <div className={classes.paginationActions}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
                <FirstPage />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
                <LeftArrow />
            </IconButton>
            <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                <RightArrow />
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                <LastPage />
            </IconButton>
        </div>
    );
}

const TableView = props => {

    const updateLogs = useCallback(data => {
        let newLogs = [...props.allLogs];
        newLogs[newLogs.findIndex(l => l.id === data.id)] = ({ ...data, vol: props.members.find(m => m.id === data.userId), ...(data.status !== 'pending' && { approverInfo: props.members.find(m => m.id === data.approver) }) });
        props.setLogs(newLogs);
    }, [props.allLogs, props.members]);

    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (page * rowsPerPage > props.logs.length) {
            setPage(0);
        }
    }, [rowsPerPage, props.logs.length]);

    return (
        props.logs.length > 0
            ? <TableContainer>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Status</TableCell>
                            <TableCell>Hours</TableCell>
                            {props.org.role !== 'vol' &&
                                <TableCell>Volunteer</TableCell>
                            }
                            <TableCell>Approver/Denier</TableCell>
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? props.logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : props.logs
                        ).map(log =>
                            <LogRow key={log.id} log={log} token={props.user.token} role={props.org.role} handleResponse={updateLogs} refresh={props.refresh} />
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[15, 25, 50, { label: 'All', value: -1 }]}
                                colSpan={7}
                                count={props.logs.length}
                                rowsPerPage={rowsPerPage}
                                page={page * rowsPerPage > props.logs.length ? 0 : page}
                                onChangePage={(event, newPage) => setPage(newPage)}
                                onChangeRowsPerPage={event => setRowsPerPage(event.target.value)}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            : <Typography variant='h6' style={{ paddingLeft: 25 }}>
                <br />No Results
            </Typography>
    );
};

export default TableView;