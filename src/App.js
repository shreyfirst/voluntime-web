import { useState } from 'react';
import Landing from './components/landing/Landing';
import ResetPassword from './components/resetPassword/ResetPassword';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
    const [user, setUser] = useState({ loggedIn: false, });

    return (
        <Router basename='/voluntime' hashType='slash'>
            <Switch>
                <Route exact path='/'>
                    <Landing user={{ id: user.id, email: user.email }} setUser={setUser} />
                </Route>
                <Route path='/dashboard'>
                    DASHBOARD
                </Route>
                <Route path='/verify'>
                    VERIFY EMAIL
                </Route>
                <Route path={['/reset-password/:id', '/reset-password']}>
                    <ResetPassword />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;