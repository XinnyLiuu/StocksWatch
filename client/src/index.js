import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import Header from './components/header/Header';

// Components
import Wrapper from './components/highcharts/Wrapper';
import Notfound from './components/error/Notfound';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Setting from './components/user/Setting';

// CSS
import './css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // https://react-bootstrap.github.io/getting-started/introduction/

// API endpoints
const monthly_api = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/monthly`;
const dow30_api = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/dow30`;

// Implement Routing
const routing = (
	<Router>
		<Header />
		<Switch>
			<Route exact path="/" component={props =>
				<Wrapper api={dow30_api}
					symbol="" />}
			/>
			<Route exact path="/search/:stock" component={props =>
				<Wrapper api={`${monthly_api}`}
					symbol={`${props.match.params.stock}`} />}
			/>
			<Route exact path="/login" component={props =>
				<Login />
			} />
			<Route exact path="/register" component={props =>
				<Register />
			} />
			<Route exact path="/settings" component={props =>
				<Setting />
			} />
			<Route component={Notfound} />
		</Switch>
	</Router>
);

ReactDOM.render(routing, document.getElementById('root'));
