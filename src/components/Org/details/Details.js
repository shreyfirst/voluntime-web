import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DetailsEdit from './DetailsEdit';
import DetailsView from './DetailsView';

const useStyles = makeStyles({
    container: {
        width: '100%',
    },
});

const Details = props => {
    const classes = useStyles();
    return (
        <Grid container className={classes.container}>
            <Grid item xs={9} sm={8} md={6} lg={5}>
                {
                    props.org.role === 'owner'
                        ? <DetailsEdit user={props.user} setUser={props.setUser} org={props.org} />
                        : <DetailsView user={props.user} setUser={props.setUser} org={props.org} />
                }
            </Grid>
        </Grid>
    );
};

export default Details;