import { useState, useEffect } from 'react';
import { getMembers } from '../../../services/orgs';
import { getLogsOrg, getLogsUserOrg } from '../../../services/logs';
import { Grid, IconButton, CircularProgress, Button, Typography, Menu, MenuItem } from '@material-ui/core';
import { Refresh as RefreshIcon, KeyboardArrowDown as OpenMenuIcon, LibraryAddCheckOutlined as AllIcon, Check as ApprovedIcon, Clear as DeniedIcon, Schedule as PendingIcon, AccountCircleOutlined as MemberIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Fetching from '../Fetching';
import TableView from './TableView';

const filterStatusNames = { all: 'All Status', approved: 'Approved', pending: 'Pending', denied: 'Denied' };

const useStyles = makeStyles(theme => ({
    all: {
        color: theme.palette.primary.main
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
    owner: {
        color: theme.palette.primary.main
    },
    admin: {
        color: theme.palette.secondary.main
    },
    vol: {
        color: theme.palette.success.main
    },
    filterMenu: {
        marginLeft: 15,
    },
    tableHeader: {
        position: 'relative',
        display: 'inline-block'
    },
    actionIcon: {
        fontSize: 32,
    },
    actionIconButton: {
        marginLeft: 25,
    }
}));

const FilterMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const close = () => setAnchorEl(null);

    const handleSelectStatus = to => {
        props.setFilterStatus(to);
        close();
    };

    const handleSelectVol = to => {
        props.setFilterVol(to);
        close();
    };

    const classes = useStyles();
    const filterStatusIcons = { all: <AllIcon className={classes.all} />, approved: <ApprovedIcon className={classes.approved} />, pending: <PendingIcon className={classes.pending} />, denied: <DeniedIcon className={classes.denied} /> };

    if (props.for === 'vol') { var selectedMember = props.filterVol === 'all' ? null : props.members.find(m => m.id === props.filterVol); }
    return (
        <>
            <Button variant='outlined' onClick={handleClick} endIcon={<OpenMenuIcon />} startIcon={props.for === 'status' ? filterStatusIcons[props.filterStatus] : props.filterVol === 'all' ? filterStatusIcons.all : <MemberIcon className={classes[selectedMember.role]} />} className={classes.filterMenu}>
                {props.for === 'status' ? filterStatusNames[props.filterStatus] : props.filterVol === 'all' ? 'All Members' : `${selectedMember.firstName} ${selectedMember.lastName}`}
            </Button>
            {
                props.for === 'status'
                    ? <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={anchorEl !== null}
                        onClose={close}
                    >
                        {
                            Object.entries(filterStatusNames).map(([s]) => <MenuItem key={s} onClick={() => handleSelectStatus(s)}>{filterStatusIcons[s]} &nbsp; {filterStatusNames[s]}</MenuItem>)
                        }
                    </Menu>
                    : <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={anchorEl !== null}
                        onClose={close}
                    >
                        <MenuItem onClick={() => handleSelectVol('all')}>{filterStatusIcons.all} &nbsp; All Members</MenuItem>
                        {
                            props.members.map(m => <MenuItem key={m.id} onClick={() => handleSelectVol(m.id)}><MemberIcon className={classes[m.role]} /> &nbsp; {m.firstName} {m.lastName}</MenuItem>)
                        }
                    </Menu>
            }
        </>
    );
};

const ViewHours = props => {
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [error, setError] = useState('');

    const [filterStatus, setFilterStatus] = useState('all');
    const [filterVol, setFilterVol] = useState('all');
    const [filteredLogs, setFilteredLogs] = useState(null);

    const refresh = () => {
        setLoadingRefresh(true);
        getMembers({
            token: props.user.token,
            id: props.org.id
        }, (err, data) => {
            if (err) {
                setError(data.message);
            } else {
                setError('');
                const roles = ['owner', 'admin', 'vol'];
                data = data.sort((a, b) => {
                    var role1 = roles.indexOf(a.role), role2 = roles.indexOf(b.role);
                    if (role1 < role2) {
                        return -1;
                    }
                    if (role2 < role1) {
                        return 1;
                    }
                    return a.firstName.localeCompare(b.firstName);
                });
                props.setMembers(data);
            }
        });
    };

    const handleLogsResponse = data => {
        setError('');
        data = data.sort((a, b) => b.start.localeCompare(a.start));
        //user object for fast lookup
        let userObj = {};
        props.members.forEach(m => userObj[m.id] = m);
        //splice user info
        data = data.map(log => ({ vol: userObj[log.userId], ...(log.status !== 'pending' && { approverInfo: userObj[log.approver] }), ...log }));
        props.setLogs(data);
    };

    const refreshLogs = () => {
        if (props.org.role === 'vol') {
            getLogsUserOrg({
                token: props.user.token,
                id: props.org.id
            }, (err, data) => {
                setLoadingRefresh(false);
                if (err) {
                    setError(data.message);
                } else {
                    handleLogsResponse(data);
                }
            });
        } else {
            getLogsOrg({
                token: props.user.token,
                id: props.org.id
            }, (err, data) => {
                setLoadingRefresh(false);
                if (err) {
                    setError(data.message);
                } else {
                    handleLogsResponse(data);
                }
            });
        }
    };

    const filterLogs = () => {
        if (filterStatus !== 'all' || filterVol !== 'all') {
            setFilteredLogs(props.logs.filter(log => (filterStatus === 'all' || log.status === filterStatus) && (filterVol === 'all' || log.userId === filterVol)));
        } else {
            //no filter selected
            setFilteredLogs(null);
        }
    };

    useEffect(() => {
        if (props.members === null) {
            refresh();
        }
    }, []);

    useEffect(() => {
        if (props.members !== null) {
            refreshLogs();
        }
    }, [props.members]);

    useEffect(filterLogs, [props.logs, filterStatus, filterVol]);

    const classes = useStyles();
    return (
        <>
            {
                error.length > 0 &&
                <Grid container>
                    <Grid item xs={12} sm={9} md={7} lg={6}>
                        <Alert severity='error'>{error}</Alert>
                        <br />
                    </Grid>
                </Grid>
            }
            {
                props.logs === null
                    ? <Fetching />
                    : <>
                        <Typography component='span'>
                            Filter By:
                        </Typography>
                        <FilterMenu for='status' filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
                        {props.org.role !== 'vol' && <FilterMenu for='vol' filterVol={filterVol} setFilterVol={setFilterVol} members={props.members} />}

                        <IconButton onClick={refresh} disabled={loadingRefresh} className={classes.actionIconButton}>
                            {loadingRefresh
                                ? <CircularProgress size={32} color='secondary' />
                                : <RefreshIcon className={classes.actionIcon} />}
                        </IconButton>
                        <br />
                        <Grid container>
                            <Grid item xs={12} lg={11}>
                                <TableView allLogs={props.logs} logs={filteredLogs === null ? props.logs : filteredLogs} setLogs={props.setLogs} user={props.user} org={props.org} members={props.members} />
                            </Grid>
                        </Grid>
                    </>
            }
        </>
    );
};

export default ViewHours;