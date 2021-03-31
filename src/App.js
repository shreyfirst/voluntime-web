import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import Landing from './components/landing/Landing';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { loginToken } from './services';

const JoinOrg = lazy(() => import('./components/joinOrg/JoinOrg'));
const VerifyEmail = lazy(() => import('./components/verifyEmail/VerifyEmail'));
const ResetPassword = lazy(() => import('./components/resetPassword/ResetPassword'));
const VerifyNewEmail = lazy(() => import('./components/verifyNewEmail/VerifyNewEmail'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Org = lazy(() => import('./components/org/Org'));

const LoadingIndicator = () => (
    <div>Loading...</div>
);

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

        let routeMatch = false;
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
            if (routeMatch.length < 1) {
                history.replace('/dashboard');
            }
            loginToken(storedUser.token, (err, data) => {
                if (err) { //couldn't log in with token
                    history.replace({ pathname: '/', state: location.pathname === '/' ? undefined : { from: location.pathname } });
                } else {
                    setUser(data);
                }
            });
        }
    }, []);

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
                <Route path={['/privacy-policy', '/terms-of-service', '/tos']} render={() => window.location.href = 'privacy-policy.html'} />
                <Route path={['/markdown', '/md']} render={() => window.location.href = 'markdown.html'} />
            </Switch>
        </Suspense>
    );
};

export default App;