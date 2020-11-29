import { makeStyles, Grid, Typography } from '@material-ui/core';
import ReactStoreBadges from 'react-store-badges';

const useStyles = makeStyles({
    textContainer: {
        minHeight: '40%',
    },
    title: {
        color: '#3d3d3c',
        fontWeight: 'bold',
    },
    description: {
        color: '#717171'
    }
});

const Product = () => {
    const classes = useStyles();
    return (
        <Grid
            container
            alignItems="center"
        >
            <Grid item xs={12} className={classes.textContainer}>
                <Typography variant="h2" component="h1" className={classes.title}>
                    Voluntime
                </Typography>
                <Typography variant="body1" className={classes.description}>
                    An all-in-one volunteer management suite built for students by students. Voluntime connects organizations and volunteers together to help educate the youth and build the future.
                </Typography>
                <br />
                <Grid container spacing={1}>
                    <Grid item>
                        <ReactStoreBadges
                            platform='ios'
                            url='https://mittaldev.com'
                            locale='en-us'
                        />
                    </Grid>
                    <Grid item>
                        <ReactStoreBadges
                            platform='android'
                            url='https://mittaldev.com'
                            locale='en'
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Product;