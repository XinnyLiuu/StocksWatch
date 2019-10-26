import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Wrapper from './components/highcharts/Wrapper';
import Notfound from './components/notfound/Notfound';
import appendErr from './components/utility/ErrorMessage';

import './css/main.css';

// API endpoints
const monthly_api = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/monthly`;
const dow30_api = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/dow30`;

// Implement Routing
const routing = (
    <Router>
        <Switch>
            <Route exact path="/" component={props =>
                <Wrapper api={dow30_api} flag={"dow30"} />
            } />

            <Route exact path="/search/:stock" component={props =>
                <Wrapper
                    api={`${monthly_api}/${props.match.params.stock}`}
                    flag={"single"} />
            } />

            <Route component={Notfound} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

appendErr({text:"Test error"}, document.getElementById('root'));
