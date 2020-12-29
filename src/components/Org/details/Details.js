import DetailsEdit from './DetailsEdit';
import DetailsView from './DetailsView';

const Details = props => {
    return (
        <>
            {
                props.org.role === 'owner'
                    ? <DetailsEdit user={props.user} setUser={props.setUser} orgs={props.orgs} setOrgs={props.setOrgs} org={props.org} />
                    : <DetailsView org={props.org} />
            }
        </>
    );
};

export default Details;