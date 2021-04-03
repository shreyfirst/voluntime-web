import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const roleNames = { owner: 'Owner', admin: 'Administrator', vol: 'Volunteer' };
const roleColors = (theme, role) => ({ owner: theme.palette.primary.main, admin: theme.palette.secondary.main, vol: theme.palette.success.main }[role]);

const useStyles = makeStyles(theme => ({
    container: {
        boxShadow: 'none',
        position: 'relative',
        marginBottom: -20,
    },
    header: props => ({
        fontWeight: 'bold',
        color: roleColors(theme, props.role)
    }),
    note: {
        color: 'rgba(0, 0, 0, 0.64)'
    },
    image: {
        borderRadius: '50%',
        display: 'inline',
        border: '1px solid black',
    },
    imagePlaceholder: props => ({
        borderRadius: '50%',
        display: 'inline-block',
        border: `1px solid ${roleColors(theme, props.role)}`,
        minHeight: 75,
        minWidth: 75,
    }),
    imageText: {
        paddingLeft: 15,
        paddingTop: 12,
    },
}));

const Member = props => {
    const member = props.member;

    const classes = useStyles({ role: member.role });
    return (
        <Card className={classes.container}>
            <CardContent>
                <Grid container style={{ paddingBottom: 3 }}>
                    <Grid item>
                        {
                            member.image?.length > 0
                                ? <img src={member.image} height={75} width={75} alt='' className={classes.image} />
                                : <div className={classes.imagePlaceholder}></div>
                        }

                    </Grid>
                    <Grid item className={classes.imageText}>
                        <div className={classes.header}>{roleNames[member.role]}</div>

                        <Typography variant='h6'>{member.firstName} {member.lastName}</Typography>
                    </Grid>
                </Grid>
                <Typography variant='body1' className={classes.note}>{member.note}</Typography>
            </CardContent>
        </Card>
    );
};

export default Member;