
import { useState, useRef } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import CreateOrg from './CreateOrg';
import OrgCard from './OrgCard';
import Archived from './Archived';

const useStyles = makeStyles({
    orgCard: {
        height: 300,
        maxWidth: 350,
        minWidth: 350,
    },
    orgSection: {
        paddingTop: 10,
        paddingBottom: '1%',
    },
});

const sortOrgs = orgs => {
    let sorted = { owner: [], admin: [], vol: [], archive: [] };
    for (const org of orgs) {
        if (org.roleActive) {
            sorted[org.active ? org.role : 'archive'].push(org);
        }
    }
    return sorted;
};

const OrgSection = props => {
    const classes = useStyles();

    return (
        <div className={classes.orgSection}>
            <Typography variant='h5'>
                {props.name}
            </Typography>
            <Grid container spacing={2}>
                {
                    props.orgs.map(org => (
                        <Grid item className={classes.orgCard} xs={12} sm={6} md={4} lg={3} key={org.id}>
                            <OrgCard org={org} />
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    );
};

const Orgs = props => {

    const [view, setView] = useState('orgs');

    const sortedOrgs = useRef(sortOrgs(props.user.orgs));
    sortedOrgs.current = sortOrgs(props.user.orgs);

    return (
        <>
            {
                view === 'create'
                    ? <CreateOrg user={props.user} setUser={props.setUser} setView={setView} />
                    : <>
                        <Button variant='outlined' onClick={() => setView('create')} startIcon={<AddIcon />}>Create Organization</Button>
                        {
                            sortedOrgs.current.owner.length < 1 && sortedOrgs.current.admin.length < 1 && sortedOrgs.current.vol.length < 1 && sortedOrgs.current.archive.length < 1 &&
                            <Typography><br />You are not part of any organizations yet. Join or create an organization to get started.</Typography>
                        }
                        {
                            sortedOrgs.current.owner.length > 0 &&
                            <OrgSection name='Owner' orgs={sortedOrgs.current.owner} />
                        }
                        {
                            sortedOrgs.current.admin.length > 0 &&
                            <OrgSection name='Administrator' orgs={sortedOrgs.current.admin} />
                        }
                        {
                            sortedOrgs.current.vol.length > 0 &&
                            <OrgSection name='Volunteer' orgs={sortedOrgs.current.vol} />
                        }
                        {
                            sortedOrgs.current.archive.length > 0 &&
                            <Archived archives={sortedOrgs.current.archive} user={props.user} setUser={props.setUser} />
                        }
                    </>
            }
        </>
    );
};

export default Orgs;