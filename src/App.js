import Landing from './components/Landing/Landing';
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
    return (
        <Router basename="/voluntime">
            <Landing />
        </Router>
    );
};

export default App;
