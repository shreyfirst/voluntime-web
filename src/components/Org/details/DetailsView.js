import { useState } from 'react';
import { Typography, Button } from '@material-ui/core';
import { RemoveCircleOutline as LeaveIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import LeaveConfirm from './LeaveConfirm';

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
    },
    imageContainer: {
        width: 350,
        height: 150,
        overflow: 'hidden',
        borderRadius: 4
    }
});
const DetailsView = props => {

    const [leaveOpen, setLeaveOpen] = useState(false);

    const classes = useStyles();
    return (
        <>
            {
                props.org.image?.length > 0 &&
                <>
                    <div className={classes.imageContainer}>
                        <img src={props.org.image} height={150} alt='' />
                    </div>
                    <br />
                </>
            }
            <br />
            <Typography variant='h5' className={classes.name}>{props.org.name}</Typography><br />
            <Typography className={classes.description}>{props.org.description}</Typography><br /><br /><br />
            <Button variant='outlined' onClick={() => setLeaveOpen(true)} startIcon={<LeaveIcon />} className={classes.leaveButton}>LEAVE ORGANIZATION</Button>
            <LeaveConfirm open={leaveOpen} setOpen={setLeaveOpen} user={props.user} setUser={props.setUser} org={props.org} />
        </>
    );
};

export default DetailsView;