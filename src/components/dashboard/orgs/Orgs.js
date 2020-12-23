
import { useState, useRef } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import CreateOrg from './CreateOrg';
import OrgCard from './OrgCard';

const useStyles = makeStyles({
    orgCard: {
        height: '300px',
    },
    orgSection: {
        paddingTop: 10,
        paddingBottom: '1%',
    },
});

const Orgs = props => {
    const classes = useStyles();

    const [view, setView] = useState('orgs');

    const orgSection = (name, orgs) => (
        <div className={classes.orgSection}>
            <Typography variant="h5">
                {name}
            </Typography>
            <Grid container spacing={2}>
                {
                    orgs.map(org => (
                        <Grid item className={classes.orgCard} xs={4} lg={3} key={org.id}>
                            <OrgCard org={org} />
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    );

    const sortOrgs = orgs => {
        var sorted = { owner: [], admin: [], vol: [] };
        for (const org of orgs) {
            sorted[org.role].push(org);
        }
        return sorted;
    };

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
                            props.user.orgs.length === 0 &&
                            'You are not part of any organizations yet.'
                        }
                        {
                            sortedOrgs.current.owner.length > 0 &&
                            orgSection('Owner', sortedOrgs.current.owner)
                        }
                        {
                            sortedOrgs.current.admin.length > 0 &&
                            orgSection('Admin', sortedOrgs.current.admin)
                        }
                        {
                            sortedOrgs.current.vol.length > 0 &&
                            orgSection('Volunteer', sortedOrgs.current.vol)
                        }
                    </>
            }
        </>
    );
};

export default Orgs;