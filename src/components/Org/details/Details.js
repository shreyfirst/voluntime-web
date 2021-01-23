import { Grid } from '@material-ui/core';
import DetailsEdit from './DetailsEdit';
import DetailsView from './DetailsView';

const Details = props => (
    <Grid container>
        <Grid item xs={9} sm={8} md={6} lg={5}>
            {
                props.org.role === 'owner'
                    ? <DetailsEdit user={props.user} setUser={props.setUser} org={props.org} />
                    : <DetailsView user={props.user} setUser={props.setUser} org={props.org} />
            }
        </Grid>
    </Grid>
);

export default Details;