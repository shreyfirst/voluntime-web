import { Link } from 'react-router-dom';

const NotFound = () => (
    <div>Organization Not Found<br /><br />The URL leads to an organization that doesn't exist or is archived. <Link to='/dashboard'>Back to Dashboard</Link></div>
);

export default NotFound;