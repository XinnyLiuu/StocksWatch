import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

// Components
import Wrapper from './components/highcharts/Wrapper';
import Notfound from './components/notfound/Notfound';
import Header from './components/header/Header';

// Utils
import appendErr from './components/utils/ErrorMessage';

// CSS
import './css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // https://react-bootstrap.github.io/getting-started/introduction/


// API endpoints
const monthly_api = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/monthly`;
const dow30_api = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/dow30`;

// Implement Routing
const routing = (
    <React.Fragment>
        <Header />
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
    </React.Fragment>
);

ReactDOM.render(routing, document.getElementById('root'));
// appendErr({ text: "Test error" }, document.getElementById('root'));
