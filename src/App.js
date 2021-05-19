import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import Join from './components/Join';
import Play from './components/Play';

const App = () => (
    <Router>
        <Route path="/" exact component={Join}/>
        <Route path="/play" exact component={Play}/>
    </Router>
);

export default App;