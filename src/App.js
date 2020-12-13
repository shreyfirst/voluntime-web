import { useEffect, useState } from 'react';
import Landing from './components/landing/Landing';
import Dashboard from './components/dashboard/Dashboard';
import VerifyEmail from './components/verifyEmail/VerifyEmail';
import ResetPassword from './components/resetPassword/ResetPassword';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { loginToken } from './services';

const App = () => {

    const location = useLocation();
    const history = useHistory();

    const [user, setUserState] = useState({ loggedIn: false, });

    const setUser = newUser => {
        setUserState(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    useEffect(() => {
        if (user.loggedIn !== false) { return; }

        const loginRoutes = ['/dashboard', '/'];

        var routeMatch = false;
        for (const r of loginRoutes) {
            if (location.pathname.startsWith(r)) {
                routeMatch = r;
                break;
            }
        }

        if (routeMatch === false) { return; }

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser === null) {
            history.replace({ pathname: '/', state: location.pathname === '/' ? undefined : { from: location.pathname } });
        } else {
            setUser(storedUser);
            if (routeMatch === '/') {
                history.replace('/dashboard');
            }
            loginToken(storedUser.token, 'normal', (err, data) => {
                if (!err) {
                    setUser(data);
                }
            });
        }

        // eslint-disable-next-line
    }, [user.loggedIn, history]);

    const LoadingUser = () => (
        <div>Loading...</div>
    );

    return (
        <Switch>
            <Route exact path='/'>
                <Landing user={{ id: user.id, email: user.email }} setUser={setUser} />
            </Route>
            <Route path={['/dashboard:id', '/dashboard']}>
                {user.loggedIn === false ? <LoadingUser /> : <Dashboard user={{ firstName: user.firstName }} />}
            </Route>
            <Route path={['/verify-email/:id', '/verify-email']}>
                <VerifyEmail setUser={setUser} />
            </Route>
            <Route path={['/reset-password/:id', '/reset-password']}>
                <ResetPassword setUser={setUser} />
            </Route>
            <Route path={['/privacy-policy', '/terms-of-service', '/tos']} render={() => { window.location.href = "privacy-policy.html" }} />
        </Switch>
    );
};

export default App;