import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    iconContainer: {
        position: 'absolute',
        marginLeft: 18,
        marginTop: 3,
    },
    textFieldLabel: {
        paddingLeft: 40,
    },
    textFieldInput: {
        paddingLeft: 55
    },
    noPadding: {
        paddingLeft: 0,
    }
});

const TextFieldIcon = props => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <span className={classes.iconContainer}>{props.icon}</span>
            <TextField {...props} style={{position: 'relative'}} inputProps={{ className: classes.textFieldInput }} InputLabelProps={{ classes: { root: classes.textFieldLabel, shrink: classes.noPadding } }} />
        </div>
    )
};

export { TextFieldIcon };