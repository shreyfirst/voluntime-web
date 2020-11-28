import { Grid, Hidden } from '@material-ui/core';
import Login from './components/Login';

const App = () => {
    return (
        <div className="App">
            <Grid container spacing={0}>
                <Grid item md={6} xs={12}>
                    hello.
                </Grid>
                <Hidden smDown>
                    <Grid item md={6}>
                        <Login />
                    </Grid>
                </Hidden>
            </Grid>
        </div>
    );
};

export default App;
