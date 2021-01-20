import { useState, useEffect } from 'react';
import { Divider, Drawer, List, Typography, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { InfoOutlined as DetailsIcon, AssessmentOutlined as MetricsIcon, PeopleAltOutlined as MembersIcon, PlaylistAdd, ListAlt, Event as EventIcon, ArrowBack as BackIcon } from '@material-ui/icons';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import NotFound from './NotFound';
import Details from './details/Details';
import Metrics from './metrics/Metrics';
import Members from './members/Members';
import AddHours from './addHours/AddHours';
import ViewHours from './viewHours/ViewHours';
import Events from './events/Events';
import VIcon from '../../images/icon.png';


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
        paddingLeft: '2.5%',
        paddingRight: '1%',
        paddingTop: '1%',
        paddingBottom: 30,
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
    }
}));

const Org = props => {
    const { orgId } = useParams();
    const history = useHistory();
    const location = useLocation();

    const getOrg = () => {
        for (const o of props.user.orgs) {
            if (o.active && o.id === orgId) {
                return o;
            }
        }
        return null;
    };

    const getViewNames = o => {
        if (o !== null) {
            if (o.role === 'owner') {
                return { 'details': 'Details', 'metrics': 'Metrics', 'members': 'Members', 'add': 'Add Hours', 'hours': 'View Hours', 'events': 'Events', 'back': 'Dashboard' };
            } else if (o.role === 'admin') {
                return { 'details': 'Details', 'members': 'Members', 'add': 'Add Hours', 'hours': 'View Hours', 'events': 'Events', 'back': 'Dashboard' };
            } else {
                return { 'details': 'Details', 'members': 'Members', 'add': 'Add Hours', 'hours': 'View Hours', 'events': 'Events', 'back': 'Dashboard' };
            }
        }
    };

    const [org, setOrg] = useState(getOrg());
    const [viewNames, setViewNames] = useState(getViewNames(org));
    const [view, setView] = useState(location.state === undefined ? 'details' : location.state.view);

    const [members, setMembers] = useState(null);
    const [logs, setLogs] = useState(null);

    useEffect(() => {
        const o = getOrg();
        setOrg(o);
        setViewNames(getViewNames(o));
    }, [props.user.orgs]);


    const render = classes => {

        const NavButton = props => (
            <ListItem button onClick={() => props.view === 'back' ? history.push('/dashboard') : setView(props.view)} className={view === props.view ? classes.activeNavButton : classes.navButton}>
                <ListItemText primary={<>{props.icon} <span className={classes.viewName}>{viewNames[props.view]}</span></>} primaryTypographyProps={{ className: `${classes.navButtonText} ${view === props.view && classes.activeNavButtonText}` }} />
            </ListItem>
        );

        const renderList = role => {
            if (role === 'owner') {
                return (<>
                    <NavButton icon={<DetailsIcon />} view='details' />
                    <NavButton icon={<MetricsIcon />} view='metrics' />
                    <NavButton icon={<MembersIcon />} view='members' />
                    <NavButton icon={<PlaylistAdd />} view='add' />
                    <NavButton icon={<ListAlt />} view='hours' />
                    <NavButton icon={<EventIcon />} view='events' />
                </>);
            } else if (role === 'admin') {
                return (<>
                    <NavButton icon={<DetailsIcon />} view='details' />
                    <NavButton icon={<MembersIcon />} view='members' />
                    <NavButton icon={<PlaylistAdd />} view='add' />
                    <NavButton icon={<ListAlt />} view='hours' />
                    <NavButton icon={<EventIcon />} view='events' />
                </>);
            } else {
                return (<>
                    <NavButton icon={<DetailsIcon />} view='details' />
                    <NavButton icon={<MembersIcon />} view='members' />
                    <NavButton icon={<PlaylistAdd />} view='add' />
                    <NavButton icon={<ListAlt />} view='hours' />
                    <NavButton icon={<EventIcon />} view='events' />
                </>);
            }
        };

        const renderView = view => {
            switch (view) {
                case 'details': return <Details user={props.user} setUser={props.setUser} org={org} />
                case 'metrics': return <Metrics user={props.user} />
                case 'members': return <Members user={props.user} members={members} setMembers={setMembers} org={org} />
                case 'add': return <AddHours user={props.user} org={org} />
                case 'hours': return <ViewHours user={props.user} members={members} setMembers={setMembers} logs={logs} setLogs={setLogs} org={org} />
                case 'events': return <Events user={props.user} />
                default: return 'Select a page on the left.'
            }
        };

        return (
            <div className={classes.container}>
                <Drawer
                    variant='permanent'
                    anchor='left'
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <img src={VIcon} alt='' className={classes.vIcon} /><br />
                        <Typography className={classes.dashboardLabel}>{org.name}</Typography>
                    </div>
                    <Divider />
                    <List>
                        {renderList(org.role)}
                        <br />
                        <Divider />
                        <NavButton view='back' icon={<BackIcon />} />
                    </List>
                </Drawer>
                <div className={classes.content}>
                    <Typography variant='h3' component='h1'>
                        {viewNames[view]}
                    </Typography><br />
                    <div className={classes.view}>
                        {renderView(view)}
                    </div>
                </div>
            </div>
        );
    };

    const classes = useStyles();
    return (
        <>
            {
                org !== null
                    ? render(classes)
                    : <NotFound />
            }
        </>
    );
};

export default Org;

/*
    OWNER:
        - Organization Details (editable)
        - Metrics (total hours, graphs, stats)
        - Members (editable) (+Invite button)
        - Log Hours
        - View Hours (editable)
        - Events (editable)
        -
    ADMIN:
        - Organization Details (view only)
        - Members (view only)
        - Log Hours
        - View Hours (editable)
        - Events (editable)
    VOLUNTEER:
        - Organization Details (view only)
        - Members (view only)
        - Log Hours
        - View Hours (view only)
        - Events (view only)
*/