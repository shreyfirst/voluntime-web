import { Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    name: {
        fontWeight: 'bold'
    },
    description: {
        color: '#343434'
    },
    leaveButton: {
        color: '#d73a49',
        fontWeight: 'bold',
        borderColor: '#d73a49',
        '&:hover': {
            color: '#FFF',
            backgroundColor: '#d73a49',
        }
    }
});
const DetailsView = props => {
    const classes = useStyles();
    return (
        <>
            <br />
            <Typography variant='h5' className={classes.name}>{props.org.name}</Typography><br />
            <Typography className={classes.description}>{props.org.description}</Typography><br /><br /><br />
            <Grid container justify='center'>
                <Button variant='outlined' className={classes.leaveButton}>LEAVE ORGANIZATION</Button>
            </Grid>
        </>
    );
};

export default DetailsView;