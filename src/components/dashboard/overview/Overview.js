import { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Fetching from '../../helpers/Fetching';
import { getLogsUser } from '../../../services/logs';
import Totals from './Totals';
import Heatmap from './Heatmap';

const useStyles = makeStyles({
    container: {
        width: '95%'
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
                        <Grid container className={classes.container}>
                            <Grid item xs={12} md={6} lg={5}>
                                <Totals logs={props.logs} />
                            </Grid>
                            <Grid item xs={6} md={12} xl={11}>
                                <Heatmap logs={props.logs} />
                            </Grid>
                        </Grid>
                    </>
            }
        </>
    );
};

export default Overview;