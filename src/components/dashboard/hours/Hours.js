import { useState, useEffect } from 'react';
import { getLogsUser } from '../../../services/logs';
import { Grid, IconButton, CircularProgress, Button, Typography, Menu, MenuItem } from '@material-ui/core';
import { Refresh as RefreshIcon, KeyboardArrowDown as OpenMenuIcon, Group as OrgIcon, LibraryAddCheckOutlined as AllIcon, Check as ApprovedIcon, Clear as DeniedIcon, Schedule as PendingIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Fetching from '../../helpers/Fetching';
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

const StatusIcon = props => {
    const classes = useStyles();
    switch (props.status) {
        case 'all': return <AllIcon className={classes.all} />;
        case 'approved': return <ApprovedIcon className={classes.approved} />;
        case 'pending': return <PendingIcon className={classes.pending} />;
        case 'denied': return <DeniedIcon className={classes.denied} />;
    }
};

const FilterMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const close = () => setAnchorEl(null);

    const handleSelectStatus = to => {
        props.setFilterStatus(to);
        close();
    };

    const handleSelectOrg = to => {
        props.setFilterOrg(to);
        close();
    };

    const classes = useStyles();

    if (props.for === 'org') { var selectedOrg = props.filterOrg === 'all' ? null : props.orgs.find(o => o.id === props.filterOrg); }
    return (
        <>
            <Button variant='outlined' onClick={handleClick} endIcon={<OpenMenuIcon />} startIcon={props.for === 'status' ? <StatusIcon status={props.filterStatus} /> : props.filterOrg === 'all' ? <StatusIcon status='all' /> : <OrgIcon className={classes[selectedOrg.role]} />} className={classes.filterMenu}>
                {props.for === 'status' ? filterStatusNames[props.filterStatus] : props.filterOrg === 'all' ? 'All Organizations' : selectedOrg.name}
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
                            Object.entries(filterStatusNames).map(([s]) => <MenuItem key={s} onClick={() => handleSelectStatus(s)}>{<StatusIcon status={s} />} &nbsp; {filterStatusNames[s]}</MenuItem>)
                        }
                    </Menu>
                    : <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={anchorEl !== null}
                        onClose={close}
                    >
                        <MenuItem onClick={() => handleSelectOrg('all')}><StatusIcon status='all' /> &nbsp; All Organizations</MenuItem>
                        {
                            props.orgs.map(o => <MenuItem key={o.id} onClick={() => handleSelectOrg(o.id)}><OrgIcon className={classes[o.role]} /> &nbsp; {o.name.length > 40 ? o.name.substring(0, 39) + '...' : o.name}</MenuItem>)
                        }
                    </Menu>
            }
        </>
    );
};

const Hours = props => {
    console.log(props.user.orgs);
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [error, setError] = useState('');

    const [filterStatus, setFilterStatus] = useState('all');
    const [filterOrg, setFilterOrg] = useState('all');
    const [filteredLogs, setFilteredLogs] = useState(null);

    const refresh = () => {
        setLoadingRefresh(true);
        getLogsUser({
            token: props.user.token,
        }, (err, data) => {
            setLoadingRefresh(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                data = data.sort((a, b) => b.start.localeCompare(a.start));
                //orgs object for fast lookup
                let orgObj = {};
                props.user.orgs.forEach(o => orgObj[o.id] = o);
                //splice org info
                data = data.map(log => ({ org: orgObj[log.orgId], ...log }));
                props.setLogs(data);
            }
        });
    };

    const filterLogs = () => {
        if (filterStatus !== 'all' || filterOrg !== 'all') {
            setFilteredLogs(props.logs.filter(log => (filterStatus === 'all' || log.status === filterStatus) && (filterOrg === 'all' || log.orgId === filterOrg)));
        } else {
            //no filter selected
            setFilteredLogs(null);
        }
    };

    useEffect(() => {
        if (props.logs === null) {
            refresh();
        }
    }, []);

    useEffect(filterLogs, [props.logs, filterStatus, filterOrg]);

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
                        <FilterMenu for='org' filterOrg={filterOrg} setFilterOrg={setFilterOrg} orgs={props.user.orgs} />

                        <IconButton onClick={refresh} disabled={loadingRefresh} className={classes.actionIconButton}>
                            {loadingRefresh
                                ? <CircularProgress size={32} color='secondary' />
                                : <RefreshIcon className={classes.actionIcon} />}
                        </IconButton>
                        <br />
                        <Grid container>
                            <Grid item xs={12} lg={11}>
                                <TableView user={props.user} logs={filteredLogs === null ? props.logs : filteredLogs} />
                            </Grid>
                        </Grid>
                    </>
            }
        </>
    );
};

export default Hours;