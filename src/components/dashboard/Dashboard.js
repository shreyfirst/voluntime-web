import { memo, useState } from 'react';
import { Divider, Drawer, List, Typography, ListItem, ListItemText, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle as AccountIcon, DashboardOutlined as OverviewIcon, Group as OrgIcon, Event as EventIcon, ListAlt as HoursIcon, ContactSupportOutlined as ContactIcon } from '@material-ui/icons';
import Account from './Account';
import Overview from './Overview';
import Orgs from './orgs/Orgs';
import Events from './Events';
import Hours from './Hours';
import Contact from './Contact';
import VIcon from '../../images/icon.png';

const viewNames = { 'overview': 'Overview', 'hours': 'Hours', 'orgs': 'Organizations', 'account': 'Account', 'events': 'Events', 'contact': 'Contact Us' };

const useStyles = makeStyles(theme => ({
    container: {
        minWidth: '100vw',
        minHeight: '100vh',
    },
    drawerPaper: {
        width: '16%',
        height: '100%',
    },
    content: {
        marginLeft: '16%',
        width: '84%',
        boxSizing: 'border-box',
        paddingLeft: '3%',
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
    const [view, setView] = useState('orgs');

    const NavButton = props => (
        <ListItem button key={props.view} onClick={() => setView(props.view)} className={view === props.view ? classes.activeNavButton : classes.navButton}>
            <ListItemText primary={<>{props.icon} <span className={classes.viewName}>{viewNames[props.view]}</span></>} primaryTypographyProps={{ className: `${classes.navButtonText} ${view === props.view && classes.activeNavButtonText}` }} />
        </ListItem>
    );

    const renderView = view => {
        switch (view) {
            case 'account': return <Account user={props.user} />
            case 'overview': return <Overview user={props.user} />
            case 'orgs': return <Orgs user={props.user} />
            case 'events': return <Events user={props.user} />
            case 'hours': return <Hours user={props.user} />
            case 'contact': return <Contact user={props.user} />
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
                    <Hidden mdDown>
                        <Typography variant="caption" component="span" className={classes.vTitle}>
                            VOLUNTIME
                        </Typography>
                    </Hidden>
                </div>
                <Divider />
                <List>
                    <NavButton view="account" icon={<AccountIcon />} />
                    <NavButton view="overview" icon={<OverviewIcon />} />
                    <NavButton view="orgs" icon={<OrgIcon />} />
                    <NavButton view="events" icon={<EventIcon />} />
                    <NavButton view="hours" icon={<HoursIcon />} />
                    <br />
                    <Divider />
                    <NavButton view="contact" icon={<ContactIcon />} />
                </List>
            </Drawer>
            <div className={classes.content}>
                <Typography variant="h3" component="h1">
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