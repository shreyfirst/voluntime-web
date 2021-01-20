import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import Landing from './components/landing/Landing';
import JoinOrg from './components/joinOrg/JoinOrg';
import VerifyEmail from './components/verifyEmail/VerifyEmail';
import ResetPassword from './components/resetPassword/ResetPassword';
import VerifyNewEmail from './components/verifyNewEmail/VerifyNewEmail';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { loginToken } from './services';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Org = lazy(() => import('./components/org/Org'));

const App = () => {
    const location = useLocation();
    const history = useHistory();

    const [user, setUserState] = useState({ loggedIn: false, });
    const setUser = useCallback(u => {
        if (u.orgs === undefined) { u.orgs = []; }
        //alphabetically sort orgs
        u.orgs = u.orgs.sort((a, b) => a.name.localeCompare(b.name));
        setUserState(u);
        localStorage.setItem('user', JSON.stringify(u));
    }, []);

    useEffect(() => {
        if (user.loggedIn !== false) { return; }

        const loginRoutes = ['dashboard', 'j', ''];

        var routeMatch = false;
        const path = location.pathname.split('/')[1];
        for (const r of loginRoutes) {
            if (path === r) {
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
            if (routeMatch === '') {
                history.replace('/dashboard');
            }
            loginToken(storedUser.token, (err, data) => {
                if (!err) {
                    setUser(data);
                }
            });
        }

        // eslint-disable-next-line
    }, []);

    const LoadingIndicator = () => (
        <div>Loading...</div>
    );

    return (
        <Suspense fallback={<LoadingIndicator />}>
            <Switch>
                <Route exact path='/'>
                    <Landing user={{ id: user.id, email: user.email }} setUser={setUser} />
                </Route>
                <Route path='/dashboard/:orgId'>
                    {user.loggedIn === false ? <LoadingIndicator /> : <Org user={user} setUser={setUser} />}
                </Route>
                <Route path='/dashboard'>
                    {user.loggedIn === false ? <LoadingIndicator /> : <Dashboard user={user} setUser={setUser} />}
                </Route>
                <Route path={['/j/:invite', '/j']}>
                    {user.loggedIn === false ? <LoadingIndicator /> : <JoinOrg user={user} setUser={setUser} />}
                </Route>
                <Route path={['/verify-email/:id', '/verify-email']}>
                    <VerifyEmail setUser={setUser} />
                </Route>
                <Route path={['/reset-password/:id', '/reset-password']}>
                    <ResetPassword setUser={setUser} />
                </Route>
                <Route path={['/verify-new-email/:id', '/verify-new-email']}>
                    <VerifyNewEmail setUser={setUser} />
                </Route>
                <Route path={['/privacy-policy', '/terms-of-service', '/tos']} render={() => { window.location.href = 'privacy-policy.html'; }} />
            </Switch>
        </Suspense>
    );
};

export default App;