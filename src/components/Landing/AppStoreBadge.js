import { makeStyles } from '@material-ui/core/styles';
import appleImage from '../../images/app-store-badge.svg';
import googleImage from '../../images/google-play-badge.svg';

const useStyles = makeStyles({
    a: {
        display: 'inline-block',
        width: 135,
        height: 40,
    },
});

const AppStoreBadge = props => {
    const classes = useStyles();

    return (
        <a href={props.url} className={classes.a}>
            <img src={props.platform === 'ios' ? appleImage : googleImage} alt={props.platform === 'ios' ? 'App Store' : 'Google Play Store'} />
        </a>
    );
};

export default AppStoreBadge;