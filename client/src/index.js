import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Highcharts from './highcharts/Highcharts'; 
import Notfound from './notfound/Notfound';

// Implement Routing
const routing = (
    <Router>
        <Switch>
            <Route exact path="/" component={ Highcharts }></Route>
            <Route component={ Notfound }></Route>
        </Switch> 
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
