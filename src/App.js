import { useState } from 'react';
import Landing from './components/landing/Landing';
import Dashboard from './components/dashboard/Dashboard';
import VerifyEmail from './components/verifyEmail/VerifyEmail';
import ResetPassword from './components/resetPassword/ResetPassword';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {

    const [user, setUser] = useState({ loggedIn: false, });

    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <Landing user={{ id: user.id, email: user.email }} setUser={setUser} />
                </Route>
                <Route path='/dashboard'>
                    <Dashboard user={{ firstName: user.firstName }} />
                </Route>
                <Route path={['/verify-email/:id', '/verify-email']}>
                    <VerifyEmail setUser={setUser} />
                </Route>
                <Route path={['/reset-password/:id', '/reset-password']}>
                    <ResetPassword setUser={setUser} />
                </Route>
                <Route path={['/privacy-policy', '/terms-of-service', '/tos']} render={() => { window.location.href = "privacy-policy.html" }} />
            </Switch>
        </Router>
    );
};

export default App;