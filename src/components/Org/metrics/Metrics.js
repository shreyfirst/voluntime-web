import { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Fetching from '../../helpers/Fetching';
import { getLogsOrg } from '../../../services/logs';
import { getMembers } from '../../../services/orgs';
import Totals from '../../dashboard/overview/totals/Totals';
import TopMember from './topMember/TopMember';
import HoursLine from './hoursLine/HoursLine';

const useStyles = makeStyles({
    container: {
        width: '95%',
        marginTop: 0,
        marginLeft: 0,
    },
    section: {
        borderRadius: 10,
        boxShadow: 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.15), inset 0 0 6px 0 rgba(0, 0, 0, 0.14)',
        backgroundColor: '#fff',
        marginBottom: 30,
    }
});

const Metrics = props => {

    const [error, setError] = useState('');

    const fetchMembers = () => {
        getMembers({
            token: props.user.token,
            id: props.org.id
        }, (err, data) => {
            if (err) {
                setError(data.message);
            } else {
                setError('');
                props.setMembers(data);
            }
        });
    };

    const fetchLogs = () => {
        getLogsOrg({
            token: props.user.token,
            id: props.org.id
        }, (err, data) => {
            if (err) {
                setError(data.message);
            } else {
                setError('');
                props.setLogs(data); //splicing handled in Org.js
            }
        });
    };

    useEffect(() => {
        if (props.members === null) {
            fetchMembers();
        }
    }, []);

    useEffect(() => {
        if(props.members !== null && props.logs === null) {
            fetchLogs();
        }
    }, [props.members]);

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
                props.logs === null || props.members === null
                    ? <Fetching />
                    : <>
                        <Grid container spacing={8} className={classes.container}>
                            <Grid item xs={12}>
                                <Grid container spacing={8} justify='space-between'>
                                    <Grid item xs={12} lg={4} className={classes.section}>
                                        <Typography variant='h6'>Total Hours</Typography><br />
                                        <Totals logs={props.logs} />
                                        <Typography variant='h6'>{props.members.length} member{props.members.length === 1 ? '' : 's'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} lg={7} className={classes.section}>
                                        <Typography variant='h6'>Top Member</Typography><br />
                                        <TopMember members={props.members} logs={props.logs} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.section}>
                                <Typography variant='h6'>Hours Graph</Typography><br />
                                <HoursLine logs={props.logs} />
                            </Grid>
                        </Grid>
                    </>
            }
        </>
    );
};

export default Metrics;