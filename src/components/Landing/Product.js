import { Grid, Typography, Link, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppStoreBadge from './AppStoreBadge';

const useStyles = makeStyles({
    textContainer: {
        minHeight: '40%',
    },
    title: {
        color: '#3d3d3c',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: '#626262',
        lineHeight: 1.75
    },
    learnMore: {
        cursor: 'pointer',
        display: 'inline'
    },
});

const Product = props => {
    const classes = useStyles();

    return (
        <Grid
            container
            alignItems='center'
        >
            <Grid item xs={12} className={classes.textContainer}>
                <Typography variant='h2' component='h1' className={classes.title}>
                    Voluntime
                </Typography>
                <Typography variant='body1' component='span' className={classes.description}>
                    An fully-featured volunteer management system built for students by students.
                    Voluntime seamlessly connects organizations and volunteers together to help build the future.
                </Typography>
                <Hidden xsDown>{' '}</Hidden>
                <Hidden smUp><br /></Hidden>
                <Link onClick={props.scrollToAbout} color='primary' underline='none'>
                    <Typography variant='body1' className={classes.learnMore}>Learn More</Typography>
                </Link>
                <br /><br />
                <Hidden smUp><br /></Hidden>
                <Grid container spacing={1}>
                    <Grid item>
                        <AppStoreBadge
                            platform='ios'
                            url='https://mittaldev.com'
                        />
                    </Grid>
                    <Grid item>
                        <AppStoreBadge
                            platform='android'
                            url='https://mittaldev.com'
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Product;