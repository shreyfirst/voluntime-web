import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse } from '@material-ui/core';
import { KeyboardArrowDown as DownArrow, KeyboardArrowUp as UpArrow } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Member from './Member';

const roleNames = { 'owner': 'Owner', 'admin': 'Admin', 'vol': 'Volunteer' };

const useStyles = makeStyles(theme => ({
    row: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    owner: {
        color: theme.palette.primary.main
    },
    admin: {
        color: theme.palette.secondary.main
    },
    vol: {
        color: theme.palette.success.main
    },
}));

const Row = props => {
    const member = props.member;
    const [open, setOpen] = useState(false);

    const classes = useStyles();
    return (
        <>
            <TableRow className={classes.row}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <UpArrow /> : <DownArrow />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" className={classes[member.role]}>
                    {roleNames[member.role]}
                </TableCell>
                <TableCell>{member.firstName}</TableCell>
                <TableCell>{member.lastName}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Member table member={member} role={props.org.role} user={props.user} org={props.org} members={props.members} setMembers={props.setMembers} />
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const TableView = props => {
    return (
        <TableContainer>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Role</TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.members.map(m => 
                        <Row key={m.id} member={m} role={props.org.role} user={props.user} org={props.org} members={props.members} setMembers={props.setMembers} />
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableView;