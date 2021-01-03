import { useState, useEffect } from 'react';
import { Grid, IconButton, CircularProgress, TextField, InputAdornment, Button } from '@material-ui/core';
import { Refresh as RefreshIcon, Search as SearchIcon, GroupAdd as InviteIcon, List as GridIcon, ViewAgendaOutlined as CardIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { getMembers } from '../../../services/orgs';
import Fetching from '../Fetching';
import Member from './Member';
import InviteLink from './InviteLink';
import TableView from './TableView';

const useStyles = makeStyles({
    container: {
        position: 'relative'
    },
    refresh: {
        position: 'absolute',
        right: 0,
        top: -18,
    },
    actionIcon: {
        fontSize: 32,
    },
});

const Members = props => {

    const [searchValue, setSearchValue] = useState('');
    const [error, setError] = useState('');
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [results, setResults] = useState(null);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteUrl, setInviteUrl] = useState(null);
    const [table, setTable] = useState(false);

    const refreshMembers = callback => {
        getMembers({
            token: props.user.token,
            id: props.org.id
        }, (err, data) => {
            if (err) {
                setError(data.message);
            } else {
                setError('');
                const roles = ['owner', 'admin', 'vol'];

                //data fabrication
                //data = [data[0], { ...data[0], firstName: 'Bobs', role: 'admin' }, data[0], { ...data[0], lastName: 'Smith', role: 'vol' }, { ...data[0], role: 'admin' }, { ...data[0], role: 'vol' }, { ...data[0], role: 'vol' }, { ...data[0], role: 'vol' }, data[0]];

                data = data.sort((a, b) => {
                    var role1 = roles.indexOf(a.role), role2 = roles.indexOf(b.role);
                    if (role1 < role2) {
                        return -1;
                    }
                    if (role2 < role1) {
                        return 1;
                    }
                    return a.firstName.localeCompare(b.firstName);
                });
                props.setMembers(data);
                if (callback !== undefined) { callback(); }
            }
        });
    };

    useEffect(() => {
        if (props.members === null) {
            refreshMembers();
        }
        const savedView = localStorage.getItem('membersView');
        if (savedView === 'table') {
            setTable(true);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('membersView', table ? 'table' : 'card');
    }, [table]);

    const handleRefresh = () => {
        setLoadingRefresh(true);
        refreshMembers(() => setLoadingRefresh(false));
    };

    const handleSearch = () => {
        if (searchValue.length > 0) {
            setResults(props.members.filter(m => (m.firstName + m.lastName).replace(/\s+/g, '').toLowerCase().includes(searchValue.replace(/\s+/g, '').toLowerCase())));
        }
    };

    useEffect(handleSearch, [searchValue, props.members]);

    const classes = useStyles();
    const MemberProps = p => <Member member={p.m} role={props.org.role} user={props.user} org={props.org} members={props.members} setMembers={props.setMembers} />;
    const TableProps = p => <TableView member={p.m} role={props.org.role} user={props.user} org={props.org} setMembers={props.setMembers} members={p.search ? results : props.members} />;
    return (
        <>
            {
                error.length > 0 &&
                <Grid container>
                    <Grid item xs={12} sm={9} md={7} lg={6}>
                        <Alert severity="error">{error}</Alert>
                        <br />
                    </Grid>
                </Grid>
            }
            <Grid container>
                <Grid item xs={12} sm={9} md={7} lg={6} className={classes.container}>
                    <span className={classes.refresh}>
                        <IconButton onClick={() => setTable(!table)}>{table ? <CardIcon className={classes.actionIcon} /> : <GridIcon className={classes.actionIcon} />}</IconButton>
                        {props.org.role !== 'vol' &&
                            <IconButton onClick={() => setInviteOpen(true)}><InviteIcon className={classes.actionIcon} /></IconButton>
                        }
                        <IconButton onClick={handleRefresh} disabled={loadingRefresh}>
                            {loadingRefresh
                                ? <CircularProgress size={32} color='secondary' />
                                : <RefreshIcon className={classes.actionIcon} />}
                        </IconButton>
                    </span>
                            Total Members: {props.members === null ? '...' : props.members.length}
                    <br /><br />
                    <TextField onChange={e => setSearchValue(e.target.value)} variant='outlined' fullWidth InputProps={{
                        placeholder: 'Search Members...', endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="search"
                                    onClick={handleSearch}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }} />
                    <br /><br />
                    {props.members === null
                        ? <Fetching />
                        : <>
                            {searchValue.length < 1 || results === null
                                ? table ? <TableProps /> : props.members.map(m => <MemberProps key={m.id} m={m} />)
                                : results.length < 1
                                    ? 'No Results'
                                    : table ? <TableProps search /> : results.map(m => <MemberProps key={m.id} m={m} />)}
                            <br />
                            <Grid container justify='center'>
                                <Button variant='contained' color='primary' onClick={() => setInviteOpen(true)} startIcon={<InviteIcon />}>Invite Members</Button>
                            </Grid>
                        </>}
                </Grid>
            </Grid>
            {inviteOpen &&
                <InviteLink url={inviteUrl} setUrl={setInviteUrl} open={inviteOpen} setOpen={setInviteOpen} user={props.user} org={props.org} />}
        </>
    );
};

export default Members;