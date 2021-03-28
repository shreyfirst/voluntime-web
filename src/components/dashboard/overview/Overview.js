import { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Fetching from '../../helpers/Fetching';
import { getLogsUser } from '../../../services/logs';
import Totals from './totals/Totals';
import Recent from './recent/Recent';
import Heatmap from './heatmap/Heatmap';

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

const Overview = props => {

    const [error, setError] = useState('');

    const fetchLogs = () => {
        getLogsUser({
            token: props.user.token,
        }, (err, data) => {
            if (err) {
                setError(data.message);
            } else {
                setError('');
                props.setLogs(data); //splicing handled in Dashboard.js
            }
        });
    };

    useEffect(() => {
        if (props.logs === null) {
            fetchLogs();
        }
    }, []);

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
                        <Grid container spacing={8} className={classes.container}>
                            <Grid item xs={12}>
                                <Grid container spacing={8} justify='space-between'>
                                    <Grid item xs={12} lg={4} className={classes.section}>
                                        <Typography variant='h6'>Total Hours</Typography><br />
                                        <Totals logs={props.logs} />
                                    </Grid>
                                    <Grid item xs={12} lg={7} className={classes.section}>
                                        <Typography variant='h6'>Recent Logs</Typography><br />
                                        <Recent logs={props.logs} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.section}>
                                <Typography variant='h6'>Contribution Heatmap</Typography><br />
                                <Heatmap logs={props.logs} />
                            </Grid>
                        </Grid>
                    </>
            }
        </>
    );
};

export default Overview;