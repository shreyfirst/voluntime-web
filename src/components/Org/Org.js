import { useState, useEffect, lazy, Suspense } from 'react';
import { Divider, Drawer, List, Typography, ListItem, ListItemText, useMediaQuery, IconButton } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Menu as MenuIcon, CancelOutlined as CloseIcon, InfoOutlined as DetailsIcon, AssessmentOutlined as MetricsIcon, PeopleAltOutlined as MembersIcon, PlaylistAdd, ListAlt, Event as EventIcon, ArrowBack as BackIcon } from '@material-ui/icons';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Fetching from '../helpers/Fetching';
import NotFound from './NotFound';
import Details from './details/Details';
import Members from './members/Members';
import AddHours from './addHours/AddHours';
import ViewHours from './viewHours/ViewHours';
import Events from './events/Events';
import VIcon from '../../images/icon.png';
const Metrics = lazy(() => import('./metrics/Metrics'));

const roles = ['owner', 'admin', 'vol'];

const getViewNames = o => {
    if (o !== null) {
        if (o.role === 'owner') {
            return { details: 'Details', metrics: 'Metrics', members: 'Members', add: 'Add Hours', hours: 'View Hours', events: 'Events', back: 'Dashboard', close: 'Close' };
        } else if (o.role === 'admin') {
            return { details: 'Details', members: 'Members', add: 'Add Hours', hours: 'View Hours', events: 'Events', back: 'Dashboard', close: 'Close' };
        } else {
            return { details: 'Details', members: 'Members', add: 'Add Hours', hours: 'View Hours', events: 'Events', back: 'Dashboard', close: 'Close' };
        }
    }
};

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
            width: '90%',
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
        }
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
        paddingLeft: '3%',
        paddingRight: '3%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'box',
        lineClamp: 1,
        boxOrient: 'vertical',
    },
    menuIcon: {
        position: 'fixed',
        left: 0,
        top: 5,
        cursor: 'pointer'
    }
}));

const View = ({ view, user, setUser, org, logs, members, setMembers, setLogs, events, setEvents }) => {
    switch (view) {
        case 'details': return <Details user={user} setUser={setUser} org={org} />;
        case 'metrics': return <Metrics user={user} org={org} logs={logs} setLogs={setLogs} members={members} setMembers={setMembers} />;
        case 'members': return <Members user={user} members={members} setMembers={setMembers} org={org} />;
        case 'add': return <AddHours user={user} org={org} />;
        case 'hours': return <ViewHours user={user} members={members} setMembers={setMembers} logs={logs} setLogs={setLogs} org={org} />;
        case 'events': return <Events user={user} org={org} events={events} setEvents={setEvents} />;
        default: return 'Select a page on the left.';
    }
};

const NavButton = ({ view, currentView, setView, setOpen, viewNames, isMobile, icon }) => {
    const history = useHistory();
    const classes = useStyles();

    const handleClick = () => {
        switch (view) {
            case 'back': history.push('/dashboard'); break;
            case 'close': setOpen(false); break;
            default: setView(view); isMobile && setOpen(false); break;
        }
    };

    return (
        <ListItem button onClick={handleClick} className={view === currentView ? classes.activeNavButton : classes.navButton}>
            <ListItemText primary={<>{icon} <span className={classes.viewName}>{viewNames[view]}</span></>} primaryTypographyProps={{ className: `${classes.navButtonText} ${view === currentView && classes.activeNavButtonText}` }} />
        </ListItem>
    );
};

const NavList = ({ role, ...props }) => {
    switch (role) {
        case 'owner': return <>
            <NavButton icon={<DetailsIcon />} view='details' {...props} />
            <NavButton icon={<MetricsIcon />} view='metrics' {...props} />
            <NavButton icon={<MembersIcon />} view='members' {...props} />
            <NavButton icon={<PlaylistAdd />} view='add' {...props} />
            <NavButton icon={<ListAlt />} view='hours' {...props} />
            <NavButton icon={<EventIcon />} view='events' {...props} />
        </>;
        case 'admin': return <>
            <NavButton icon={<DetailsIcon />} view='details' {...props} />
            <NavButton icon={<MembersIcon />} view='members' {...props} />
            <NavButton icon={<PlaylistAdd />} view='add' {...props} />
            <NavButton icon={<ListAlt />} view='hours' {...props} />
            <NavButton icon={<EventIcon />} view='events' {...props} />
        </>;
        default: return <>
            <NavButton icon={<DetailsIcon />} view='details' {...props} />
            <NavButton icon={<MembersIcon />} view='members' {...props} />
            <NavButton icon={<PlaylistAdd />} view='add' {...props} />
            <NavButton icon={<ListAlt />} view='hours' {...props} />
            <NavButton icon={<EventIcon />} view='events' {...props} />
        </>;
    }
};

const Org = props => {
    const { orgId } = useParams();
    const location = useLocation();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getOrg = () => {
        for (const o of props.user.orgs) {
            if (o.active && o.id === orgId) {
                return o;
            }
        }
        return null;
    };

    const [org, setOrg] = useState(getOrg());
    const [viewNames, setViewNames] = useState(getViewNames(org));
    const [view, setView] = useState(location.state === undefined ? 'details' : location.state.view);
    const [open, setOpen] = useState(false);

    const [members, setMembersState] = useState(null);
    const [logs, setLogsState] = useState(null);
    const [events, setEventsState] = useState(null);

    const setMembers = newMembers => {
        newMembers = newMembers.sort((a, b) => {
            let role1 = roles.indexOf(a.role), role2 = roles.indexOf(b.role);
            if (role1 < role2) {
                return -1;
            }
            if (role2 < role1) {
                return 1;
            }
            return a.firstName.localeCompare(b.firstName);
        });
        setMembersState(newMembers);
    };

    const setLogs = newLogs => {
        newLogs = newLogs.sort((a, b) => b.end.localeCompare(a.end));
        //user object for fast lookup
        let userObj = {};
        members.forEach(m => userObj[m.id] = m);
        //splice user info
        let newData = [];
        for (let i = 0; i < newLogs.length; ++i) {
            const log = newLogs[i];
            newData.push({ vol: userObj[log.userId], ...(log.status !== 'pending' && { approverInfo: userObj[log.approver] }), ...log });
        }
        setLogsState(newData);
    };

    const setEvents = newEvents => setEventsState(newEvents.sort((a, b) => b.start.localeCompare(a.start)));

    useEffect(() => {
        const o = getOrg();
        setOrg(o);
        setViewNames(getViewNames(o));
    }, [props.user.orgs]);

    const classes = useStyles();
    return (
        <>
            {
                org !== null
                    ? <div className={classes.container}>
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
                                <Typography className={classes.dashboardLabel}>{org.name}</Typography>
                            </div>
                            <Divider />
                            <List>
                                <NavList role={org.role} currentView={view} setView={setView} viewNames={viewNames} isMobile={isMobile} setOpen={setOpen} />
                                <br />
                                <Divider />
                                <NavButton view='back' icon={<BackIcon />} viewNames={viewNames} isMobile={isMobile} setOpen={setOpen} />
                                {
                                    isMobile &&
                                    <>
                                        <br />
                                        <Divider />
                                        <NavButton view='close' icon={<CloseIcon />} viewNames={viewNames} isMobile={isMobile} setOpen={setOpen} />
                                    </>
                                }
                            </List>
                        </Drawer>
                        <div className={classes.content}>
                            <Typography variant='h3' component='h1'>
                                {viewNames[view]}
                            </Typography><br />
                            <div className={classes.view}>
                                <Suspense fallback={<Fetching />}>
                                    <View view={view} user={props.user} setUser={props.setUser} org={org} members={members} logs={logs} setMembers={setMembers} setLogs={setLogs} events={events} setEvents={setEvents} />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                    : <NotFound />
            }
        </>
    );
};

export default Org;