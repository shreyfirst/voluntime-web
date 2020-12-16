import { memo, useState } from 'react';
import { Divider, Drawer, List, Typography, ListItem, ListItemText, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle as AccountIcon, DashboardOutlined as OverviewIcon, Group as OrgIcon, ListAlt as HoursIcon, ExitToApp as LogoutIcon } from '@material-ui/icons';
import Account from './Account';
import Overview from './Overview';
import Orgs from './Orgs';
import Hours from './Hours';
import Logout from './Logout';
import VIcon from '../../images/icon.png';

const viewNames = { 'overview': 'Overview', 'hours': 'Hours', 'orgs': 'Organizations', 'account': 'Account', 'logout': 'Logout' };

const useStyles = makeStyles(theme => ({
    container: {
        minWidth: '100vw',
        minHeight: '100vh',
    },
    drawerPaper: {
        width: '15%',
        height: '100%',
    },
    content: {
        marginLeft: '15%',
        width: '85%',
        boxSizing: 'border-box',
        paddingLeft: '5%',
        paddingRight: '1%',
        paddingTop: '1%',
    },
    drawerHeader: {
        paddingTop: '8%',
        paddingBottom: '8%',
        textAlign: 'center'
    },
    navButton: {
        "&::before": {
            content: '""',
            height: '100%',
            width: 8,
        }
    },
    activeNavButton: {
        backgroundColor: '#DADADA',
        "&:hover": {
            backgroundColor: "#DADADA"
        },
        "&::before": {
            content: '""',
            height: '100%',
            position: 'absolute',
            backgroundColor: theme.palette.primary.main,
            width: 8,
            left: 0,
        }
    },
    navButtonText: {
        display: 'flex',
        alignItems: 'stretch',
        flexWrap: 'wrap',
    },
    activeNavButtonText: {
        color: theme.palette.primary.main,
        marginLeft: 8
    },
    viewName: {
        marginLeft: '1em',
    },
    vIcon: {
        height: '3em',
        verticalAlign: 'middle'
    },
    vTitle: {
        verticalAlign: 'middle',
        marginLeft: '0.5em',
        fontSize: '3ex',
    }
}));


const Dashboard = props => {
    const classes = useStyles();
    const [view, setView] = useState('overview');

    const NavButton = props => (
        <ListItem button key={props.view} onClick={() => setView(props.view)} className={view === props.view ? classes.activeNavButton : classes.navButton}>
            <ListItemText primary={<>{props.icon} <span className={classes.viewName}>{viewNames[props.view]}</span></>} primaryTypographyProps={{ className: `${classes.navButtonText} ${view === props.view && classes.activeNavButtonText}` }} />
        </ListItem>
    );

    const renderView = view => {
        switch (view) {
            case 'account': return <Account />
            case 'overview': return <Overview />
            case 'orgs': return <Orgs />
            case 'hours': return <Hours />
            case 'logout': return <Logout />
            default: return 'Select a page on the left.'
        }
    };

    return (
        <div className={classes.container}>
            <Drawer
                variant="permanent"
                anchor="left"
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <div className={classes.drawerHeader}>
                    <img src={VIcon} alt="" className={classes.vIcon} />
                    <Typography variant="caption" component="span" className={classes.vTitle}>
                        VOLUNTIME
                    </Typography>
                </div>
                <Divider />
                <List>
                    <NavButton view="account" icon={<AccountIcon />} />
                    <NavButton view="overview" icon={<OverviewIcon />} />
                    <NavButton view="orgs" icon={<OrgIcon />} />
                    <NavButton view="hours" icon={<HoursIcon />} />
                    <NavButton view="logout" icon={<LogoutIcon />} />
                </List>
            </Drawer>
            <div className={classes.content}>
                <Typography variant="h3" component="h1" className={classes.title}>
                    {viewNames[view]}
                </Typography><br />
                <div className={classes.view}>
                    {renderView(view)}
                </div>
            </div>
        </div>
    );
};

export default memo(Dashboard);