import React from 'react';
import {
	Navbar,
	Nav,
	Form,
	FormControl,
	Button
} from "react-bootstrap";
import {
	withRouter
} from "react-router-dom";

import {
	isAuthenticated,
	getUserInfo,
	destroySession
} from '../../utils/auth';

class Header extends React.Component {
	constructor(props) {
		super(props);

		// Search value will be stored in state
		this.state = {
			symbol: '',
			url: '',
			firstname: '',
			lastname: '',
			username: ''
		};

		// Bind, so that 'this' can be used in the callback
		this.searchStock = this.searchStock.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.logout = this.logout.bind(this);
	}

	// Dynamically updates the `symbol` stored in state on input change
	handleChange(event) {
		this.setState({
			symbol: event.target.value
		});
	}

	// Fires when form is submitted
	searchStock(e) {
		e.preventDefault();

		// Cleanup `symbol`
		let symbol = this.state.symbol;
		symbol = symbol.toUpperCase().trim();

		// Update `url` flag in state
		this.setState({
			url: `/search/${symbol}`
		}, () => this.props.history.push(this.state.url));
	}

	// On click, log the user out
	logout() {
		destroySession();

		// Redirect to home
		this.props.history.push("/");
	}

	render() {
		let navbar = (
			<Navbar sticky="top" bg="dark" variant="dark" expand="lg">
				<Navbar.Brand href="/">StocksWatch</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link href="/login">Login</Nav.Link>
						<Nav.Link href="/register">Register</Nav.Link>
					</Nav>
					<Form inline onSubmit={this.searchStock}>
						<FormControl type="text" value={this.state.symbol} onChange={this.handleChange} placeholder="Search a Symbol" className="mr-sm-2" />
						<Button id="searchBtn" variant="outline-info" type="submit">Search</Button>
					</Form>
				</Navbar.Collapse>
			</Navbar>
		);

		// Check if an user is logged in
		if (isAuthenticated()) {
			const user = getUserInfo();

			navbar = (
				<Navbar sticky="top" bg="dark" variant="dark" expand="lg">
					<Navbar.Brand href="/">StocksWatch</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							<Nav.Link disabled>
								<span id="name">{user.getFirstName()} {user.getLastName()}</span>
							</Nav.Link>
							<Nav.Link href="/watchlist">Watchlist</Nav.Link>
							<Nav.Link href="/settings">Settings</Nav.Link>
							<Nav.Link onClick={this.logout} href="/">Logout</Nav.Link>
						</Nav>
						<Form inline onSubmit={this.searchStock}>
							<FormControl type="text" value={this.state.symbol} onChange={this.handleChange} placeholder="Search a Symbol" className="mr-sm-2" />
							<Button id="searchBtn" variant="outline-info" type="submit">Search</Button>
						</Form>
					</Navbar.Collapse>
				</Navbar>
			);
		}

		return navbar;
	}
}

export default withRouter(Header);
