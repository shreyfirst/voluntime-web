import { makeStyles } from '@material-ui/core/styles';
import appleImage from '../../images/app-store-badge.svg';
import googleImage from '../../images/google-play-badge.svg';

const useStyles = makeStyles({
    a: {
        display: 'inline-block',
        width: 135,
        height: 40,
        cursor: 'pointer'
    },
});

const AppStoreBadge = props => {
    const classes = useStyles();

    //when app is ready, href={props.url}
    return (
        <a onClick={() => alert(`The Voluntime ${props.platform === 'ios' ? 'iOS' : 'Android'} app is not available yet! For now, a desktop screen is recommended for use of Voluntime.`)} className={classes.a}>
            <img src={props.platform === 'ios' ? appleImage : googleImage} alt={props.platform === 'ios' ? 'App Store' : 'Google Play Store'} />
        </a>
    );
};

export default AppStoreBadge;