import { useState } from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse, Typography } from '@material-ui/core';
import { KeyboardArrowDown as DownArrow, KeyboardArrowUp as UpArrow } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import OrgCard from './OrgCard';

const roleNames = { 'owner': 'Owner', 'admin': 'Admin', 'vol': 'Volunteer' };

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: 10,
        paddingBottom: '1%',
    },
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
    cellText: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '10em',
    },
    orgCard: {
        height: 300,
        maxWidth: 350
    },
}));

const Row = props => {
    const [open, setOpen] = useState(false);

    const classes = useStyles();
    return (
        <>
            <TableRow className={classes.row}>
                <TableCell>
                    <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
                        {open ? <UpArrow /> : <DownArrow />}
                    </IconButton>
                </TableCell>
                <TableCell component='th' scope='row' className={classes[props.org.role]}>
                    {roleNames[props.org.role]}
                </TableCell>
                <TableCell className={classes.cellText}>{props.org.name}</TableCell>
                <TableCell className={classes.cellText}>{props.org.description}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <Grid container>
                            <Grid item xs={6} className={classes.orgCard}>
                                <OrgCard archive org={props.org} user={props.user} setUser={props.setUser} />
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const Archived = props => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Typography variant='h5'>
                Archived
            </Typography>
            <Grid container>

                <Grid item xs={12} md={10} lg={8}>
                    <TableContainer>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Role</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.archives.map(o =>
                                    <Row key={o.id} org={o} user={props.user} setUser={props.setUser} />
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
};

export default Archived;