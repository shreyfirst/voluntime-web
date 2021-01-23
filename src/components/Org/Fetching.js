import { Grid, CircularProgress } from '@material-ui/core';

const Fetching = () => (
    <Grid container item xs={3} justify='center'>
        <CircularProgress size={60} thickness={5} color='secondary' />
    </Grid>
);

export default Fetching;