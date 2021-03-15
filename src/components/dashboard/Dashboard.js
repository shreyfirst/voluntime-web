import { memo, useState } from 'react';
import { Divider, Drawer, List, Typography, ListItem, ListItemText, useMediaQuery, IconButton } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Menu as MenuIcon, CancelOutlined as CloseIcon, AccountCircle as AccountIcon, DashboardOutlined as OverviewIcon, Group as OrgIcon, Event as EventsIcon, ListAlt as HoursIcon, ContactSupportOutlined as ContactIcon } from '@material-ui/icons';
import Account from './account/Account';
import Overview from './overview/Overview';
import Orgs from './orgs/Orgs';
import Events from './Events';
import Hours from './hours/Hours';
import Contact from './Contact';
import VIcon from '../../images/icon.png';

const viewNames = { overview: 'Overview', hours: 'Hours', orgs: 'Organizations', account: 'Account', events: 'Events', contact: 'Contact Us' };

const useStyles = makeStyles(theme => ({
    container: {
        minWidth: '100vw',
        minHeight: '100vh',
    },
    drawerPaper: {
        width: '16%',
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            width: '50%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '70%',
        },
    },
    content: {
        marginLeft: '16%',
        width: '84%',
        boxSizing: 'border-box',
        paddingLeft: '2.5%',
        paddingRight: '1%',
        paddingTop: '1%',
        paddingBottom: 30,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 40,
            width: '100%',
            paddingLeft: '1%',
        },
    },
    drawerHeader: {
        paddingTop: '8%',
        paddingBottom: '8%',
        textAlign: 'center'
    },
    navButton: {
        '&::before': {
            content: '""',
            height: '100%',
            width: 8,
        },
    },
    activeNavButton: {
        backgroundColor: '#DADADA',
        '&:hover': {
            backgroundColor: '#DADADA'
        },
        '&::before': {
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
    dashboardLabel: {
        fontWeight: 'bold',
        fontSize: '1.2em',
        paddingTop: '1%',
    },
    menuIcon: {
        position: 'fixed',
        left: 0,
        top: 5,
        cursor: 'pointer'
    }
}));


const View = ({ view, user, setUser, logs, setLogs }) => {
    switch (view) {
        case 'account': return <Account user={user} setUser={setUser} />
        case 'overview': return <Overview user={user} logs={logs} setLogs={setLogs} />
        case 'orgs': return <Orgs user={user} setUser={setUser} />
        case 'events': return <Events user={user} />
        case 'hours': return <Hours user={user} logs={logs} setLogs={setLogs} />
        case 'contact': return <Contact user={user} />
        default: return 'Select a page on the left.'
    }
};

const NavButton = props => {
    const classes = useStyles();

    return (
        <ListItem button onClick={() => { props.setView(props.view); props.isMobile && props.setOpen(false); }} className={props.view === props.currentView ? classes.activeNavButton : classes.navButton}>
            <ListItemText primary={<>{props.icon} <span className={classes.viewName}>{viewNames[props.view]}</span></>} primaryTypographyProps={{ className: `${classes.navButtonText} ${props.view === props.currentView && classes.activeNavButtonText}` }} />
        </ListItem>
    );
};

const Dashboard = props => {
    const classes = useStyles();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [view, setView] = useState('orgs');
    const [open, setOpen] = useState(false);

    const [logs, setLogsState] = useState(null);
    const setLogs = newLogs => {
        newLogs = newLogs.sort((a, b) => b.start.localeCompare(a.start));
        //orgs object for fast lookup
        let orgObj = {};
        props.user.orgs.forEach(o => orgObj[o.id] = o);
        //splice org info
        newLogs = newLogs.map(log => ({ org: orgObj[log.orgId], ...log }));
        setLogsState(newLogs);
    };

    return (
        <div className={classes.container}>
            {
                isMobile &&
                <IconButton onClick={() => setOpen(true)} className={classes.menuIcon}>
                    <MenuIcon />
                </IconButton>
            }
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile && open}
                anchor='left'
                classes={{
                    paper: classes.drawerPaper
                }}
                ModalProps={isMobile ? { onBackdropClick: () => setOpen(false) } : undefined}
            >
                <div className={classes.drawerHeader}>
                    <img src={VIcon} alt='' className={classes.vIcon} /><br />
                    <Typography className={classes.dashboardLabel}>Dashboard</Typography>
                </div>
                <Divider />
                <List>
                    <NavButton view='account' icon={<AccountIcon />} currentView={view} setView={setView} isMobile={isMobile} setOpen={setOpen} />
                    <NavButton view='overview' icon={<OverviewIcon />} currentView={view} setView={setView} isMobile={isMobile} setOpen={setOpen} />
                    <NavButton view='orgs' icon={<OrgIcon />} currentView={view} setView={setView} isMobile={isMobile} setOpen={setOpen} />
                    <NavButton view='events' icon={<EventsIcon />} currentView={view} setView={setView} isMobile={isMobile} setOpen={setOpen} />
                    <NavButton view='hours' icon={<HoursIcon />} currentView={view} setView={setView} isMobile={isMobile} setOpen={setOpen} />
                    <br />
                    <Divider />
                    <NavButton view='contact' icon={<ContactIcon />} currentView={view} setView={setView} isMobile={isMobile} setOpen={setOpen} />
                    {
                        isMobile &&
                        <>
                            <br />
                            <Divider />
                            <ListItem button onClick={() => setOpen(false)} className={classes.navButton}>
                                <ListItemText primary={<>{<CloseIcon />} <span className={classes.viewName}>Close</span></>} primaryTypographyProps={{ className: classes.navButtonText }} />
                            </ListItem>
                        </>
                    }
                </List>
            </Drawer>
            <div className={classes.content}>
                <Typography variant='h3' component='h1'>
                    {viewNames[view]}
                </Typography><br />
                <div className={classes.view}>
                    <View view={view} user={props.user} setUser={props.setUser} logs={logs} setLogs={setLogs} />
                </div>
            </div>
        </div>
    );
};

export default memo(Dashboard);