import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

// Components
import Header from './components/header/Header';
import Wrapper from './components/highcharts/Wrapper';
import WatchlistCharts from './components/highcharts/WatchlistCharts';
import Notfound from './components/alert/Notfound';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Setting from './components/user/Setting';
import Watchlist from './components/user/Watchlist';

// CSS
import './css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // https://react-bootstrap.github.io/getting-started/introduction/

// Utils 
import {
    isAuthenticated
} from './utils/auth';

// API endpoints
const yearly_api = `${process.env.REACT_APP_SERVER_DOMAIN}/api/stocks/yearly`;
const dow30_api = `${process.env.REACT_APP_SERVER_DOMAIN}/api/stocks/dow30`;
const watchlist_api = `${process.env.REACT_APP_SERVER_DOMAIN}/api/stocks/watchlist`;

// Implement Routing
const routing = (
    <Router>
        <Header />
        <Switch>
            <Route exact path="/" component={props =>
                isAuthenticated() === true ? <WatchlistCharts api={watchlist_api} /> : <Wrapper api={dow30_api} symbol="" />
            } />
            <Route exact path="/search/:stock" component={props =>
                <Wrapper api={yearly_api} symbol={props.match.params.stock} />
            } />
            <Route exact path="/login" component={props =>
                isAuthenticated() === false ? <Login /> : <Notfound />
            } />
            <Route exact path="/register" component={props =>
                isAuthenticated() === false ? <Register /> : <Notfound />
            } />
            <Route exact path="/settings" component={props =>
                isAuthenticated() === true ? <Setting /> : <Notfound />
            } />
            <Route exact path="/watchlist" component={props =>
                isAuthenticated() === true ? <Watchlist /> : <Notfound />
            } />
            <Route component={Notfound} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById("root"));