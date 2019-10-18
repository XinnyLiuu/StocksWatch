import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import StockChart from './highcharts/StockChart';
import Notfound from './notfound/Notfound';

// Implement Routing
const routing = (
    <Router>
        <Switch>
            <Route exact path="/search/:stock" component={props => <StockChart stock={props.match.params.stock} />} />
            <Route component={Notfound} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
