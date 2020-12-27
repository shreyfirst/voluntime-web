import { useParams } from 'react-router-dom';

const Org = () => {
    const { orgId } = useParams();

    return (
        <div>
            Org ID: {orgId}
        </div>
    );
};

export default Org;