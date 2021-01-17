import { useState, useEffect } from 'react';
import { getMembers } from '../../../services/orgs';
import { getLogsOrg, getLogsUserOrg } from '../../../services/logs';
import { Grid, IconButton, CircularProgress, TextField, InputAdornment, Button, Tooltip, Typography } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import Fetching from '../Fetching';
import TableView from './TableView';


const ViewHours = props => {
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [error, setError] = useState('');
    const [totalHours, setTotalHours] = useState('...');

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
        data = data.map(log => ({ vol: userObj[log.userId], ...(log.status === 'approved' && { approverInfo: userObj[log.approver] }), ...log }));
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

    useEffect(() => {
        if (props.logs !== null) {
            setTotalHours(props.logs.reduce((sum, log) => sum + log.hours, 0));
        }
    }, [props.logs]);

    return (
        <>
            {
                error.length > 0 &&
                <Grid container>
                    <Grid item xs={12} sm={9} md={7} lg={6}>
                        <Alert severity="error">{error}</Alert>
                        <br />
                    </Grid>
                </Grid>
            }
            <Typography>
                Total volunteer hours: {totalHours}<br /><br />
                Filter By: Status Volunteer
            </Typography>
            {
                props.logs === null
                    ? <Fetching />
                    : <Grid container>
                        <Grid item xs={12} lg={11}>
                            <TableView logs={props.logs} user={props.user} org={props.org} />
                        </Grid>
                    </Grid>
            }
        </>
    );
};

export default ViewHours;