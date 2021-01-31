import { useState } from 'react';
import { Typography, Button } from '@material-ui/core';
import { RemoveCircleOutline as LeaveIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import LeaveConfirm from './LeaveConfirm';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const useStyles = makeStyles({
    name: {
        fontWeight: 'bold'
    },
    description: {
        color: '#343434',
        '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#FBFBFB'
        },
        '& thead': {
            backgroundColor: '#e9ecef',
        },
        '& th': {
            padding: 20,
            wordWrap: 'break-word',
            border: '1px solid #dee2e6'
        },
        '& td': {
            padding: 20,
            wordWrap: 'break-word',
            border: '1px solid #dee2e6'
        }
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
            <Typography component='div'>
                <ReactMarkdown plugins={[gfm]}
                    renderers={{ link: props => <a href={props.href} target='_blank' rel='noopener noreferrer'>{props.children}</a> }}
                    className={classes.description}>{props.org.description}</ReactMarkdown>
            </Typography>
            <br /><br /><br />
            <Button variant='outlined' onClick={() => setLeaveOpen(true)} startIcon={<LeaveIcon />} className={classes.leaveButton}>LEAVE ORGANIZATION</Button>
            <LeaveConfirm open={leaveOpen} setOpen={setLeaveOpen} user={props.user} setUser={props.setUser} org={props.org} />
        </>
    );
};

export default DetailsView;