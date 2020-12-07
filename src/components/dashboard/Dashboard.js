import { memo } from 'react';

const Dashboard = props => {
    return (
        <>
            DASHBOARD: Welcome, {props.user.firstName}!
        </>
    );
};

export default memo(Dashboard);