import { useState } from 'react';
import Landing from './components/Landing/Landing';
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
    const [user, setUser] = useState({ loggedIn: false, });

    return (
        <Router basename="/voluntime">
            <Landing user={{ id: user.id, email: user.email }} setUser={setUser} />
        </Router>
    );
};

export default App;