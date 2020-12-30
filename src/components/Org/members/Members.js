import { useState, useEffect } from 'react';
import { Grid, IconButton, CircularProgress, TextField, InputAdornment } from '@material-ui/core';
import { Refresh as RefreshIcon, Search as SearchIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { getMembers } from '../../../services/orgs';
import Fetching from '../Fetching';
import Member from './Member';

const useStyles = makeStyles({
    container: {
        position: 'relative'
    },
    refresh: {
        position: 'absolute',
        right: 0,
        top: -20,
    },
    refreshIcon: {
        fontSize: 35,
    }
});

const Members = props => {

    const [searchValue, setSearchValue] = useState('');
    const [error, setError] = useState('');
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [results, setResults] = useState(null);

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
                data = [data[0], { ...data[0], firstName: 'Bobs', role: 'admin' }, data[0], { ...data[0], lastName: 'Smith', role: 'vol' }, { ...data[0], role: 'admin' }, { ...data[0], role: 'vol' }, { ...data[0], role: 'vol' }, { ...data[0], role: 'vol' }, data[0]];
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
    }, []);

    const handleRefresh = () => {
        setLoadingRefresh(true);
        refreshMembers(() => setLoadingRefresh(false));
    };

    const handleSearch = () => {
        if (searchValue.length > 0) {
            setResults(props.members.filter(m => m.firstName.toLowerCase().includes(searchValue.toLowerCase()) || m.lastName.toLowerCase().includes(searchValue.toLowerCase())));
        }
    };

    useEffect(handleSearch, [searchValue, props.members])

    const classes = useStyles();
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
            {
                props.members === null
                    ? <Fetching />
                    : <Grid container>
                        <Grid item xs={12} sm={9} md={7} lg={6} className={classes.container}>
                            <IconButton onClick={handleRefresh} className={classes.refresh}>
                                {loadingRefresh
                                    ? <CircularProgress size={35} color='secondary' />
                                    : <RefreshIcon className={classes.refreshIcon} />}
                            </IconButton>
                            Total Members: {props.members.length}
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
                            {searchValue.length < 1 || results === null
                                ? props.members.map(m => <Member key={m.id} member={m} />)
                                : results.length < 1
                                    ? 'No Results'
                                    : results.map(m => <Member key={m.id} member={m} />)}
                        </Grid>
                    </Grid>
            }
        </>
    );
};

export default Members;