import { useState, useEffect } from 'react';
import { getMembers } from '../../../services/orgs';
import { getLogsOrg } from '../../../services/logs';
import { Grid, IconButton, CircularProgress, TextField, InputAdornment, Button, Tooltip } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import Fetching from '../Fetching';
import TableView from './TableView';

const ViewHours = props => {
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [error, setError] = useState('');

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

    const refreshLogs = () => {
        getLogsOrg({
            token: props.user.token,
            id: props.org.id
        }, (err, data) => {
            setLoadingRefresh(false);
            if (err) {
                setError(data.message);
            } else {
                setError('');
                data = data.sort((a, b) => a.start.localeCompare(b.start));
                //user object for fast lookup
                let userObj = {};
                props.members.forEach(m => userObj[m.id] = m);
                //splice user info
                data = data.map(log => ({ vol: userObj[log.userId], ...(log.status === 'approved' && { approverInfo: userObj[log.approver] }), ...log }));
                props.setLogs(data);
            }
        });
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