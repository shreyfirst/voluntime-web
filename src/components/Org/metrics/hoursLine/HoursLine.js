import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsiveLine } from '@nivo/line';

const useStyles = makeStyles({
    container: {
        width: '100%',
        height: 500
    }
});

const HoursLine = props => {
    const [parsedLogs, setParsedLogs] = useState(null);

    const parseLogs = () => {
        let parsed = [];
        props.logs.slice().reverse().forEach(log => {
            if (log.status === 'approved') {
                const date = log.end.split('T')[0];
                if (parsed.length === 0 || parsed[parsed.length - 1].x !== date) {
                    parsed.push({ x: date, y: log.hours });
                } else {
                    parsed[parsed.length - 1].y += log.hours;
                }
            }
        });
        setParsedLogs([{
            id: 1,
            color: '#FF0000',
            data: parsed
        }]);
    };

    useEffect(parseLogs, [props.logs]);

    const classes = useStyles();
    return (
        <>
            {
                props.logs.length === 0
                    ? 'No Data'
                    : parsedLogs !== null &&
                    <div className={classes.container}>
                        <ResponsiveLine
                            colors={['#f50057']}
                            xScale={{
                                type: 'time',
                                format: '%Y-%m-%d',
                                useUTC: false,
                                precision: 'day',
                            }}
                            xFormat="time:%Y-%m-%d"
                            axisBottom={{
                                format: '%b %Y',
                                tickValues: 'every 1 month',
                            }}
                            useMesh
                            enableSlices={false}
                            margin={{ top: 0, right: 0, bottom: 30, left: 30 }}
                            animate={false}
                            data={parsedLogs}
                        />
                    </div>
            }
        </>
    );
};

export default HoursLine;