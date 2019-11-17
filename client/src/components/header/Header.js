import React from 'react';
import {
	Navbar,
	Nav,
	Form,
	Button,
	ToggleButtonGroup,
	ToggleButton
} from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead"; // http://ericgio.github.io/react-bootstrap-typeahead/#top
import { withRouter } from "react-router-dom";

import Error from '../alert/Error';

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
			url: '',
			firstname: '',
			lastname: '',
			username: '',
			symbols: [],
			companies: [],
			data: [], // This will be an array of symbols or companies, default is symbols
			dataType: '', // Type of data - symbol or company
			error: false,
			searchText: "Search by Symbol", // Text for the searchInput ,
			searchValue: '', // Value to be searched
		};

		// Bind, so that 'this' can be used in the callback
		this.searchStock = this.searchStock.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.logout = this.logout.bind(this);
		this.toggleChange = this.toggleChange.bind(this);
	}

	/** 
	 * onChange listener for the Typeahead component
	 * 
	 * Returns an array of elements selected
	 * 
	 * https://github.com/ericgio/react-bootstrap-typeahead/blob/master/docs/Props.md
	 */
	handleChange(event) {
		this.setState({
			searchValue: event[0]
		});
	}

	/**
	 * onChange listener for Toggle
	 * 
	 * Returns value of toggle 
	 * 
	 * https://react-bootstrap.netlify.com/components/buttons/
	 */
	toggleChange(event) {
		if (event === 1) {
			// Symbol
			this.setState({
				searchText: "Search by Symbol",
				data: this.state.symbols,
				dataType: "symbol"
			})
		} else {
			// Company
			this.setState({
				searchText: "Search by Company",
				data: this.state.companies,
				dataType: "company"
			})
		}
	}

	// Fires when form is submitted
	async searchStock(e) {
		e.preventDefault();

		/**
		 * Check the data type, for `company` we have to query for the symbol
		 */
		if (this.state.dataType === "company") {
			try {
				const symbol = await this.getSymbolForCompany(this.state.searchValue);

				this.setState({ searchValue: symbol });
			} catch (err) {
				this.setState({ error: true });
			}
		}

		// Update `url` flag in state
		this.setState({
			url: `/search/${this.state.searchValue}`
		}, () => this.props.history.push(this.state.url));
	}

	// On click, log the user out
	logout() {
		destroySession();

		// Redirect to home
		this.props.history.push("/");
	}

	// Grabs the list of symbol / companies to search for
	async prepareSearchbar() {
		// Check if localStorage has symbols in store
		if (!localStorage.getItem("symbols")) {

			// Get the list of symbols from the server
			const url = `${process.env.REACT_APP_SERVER_DOMAIN}/api/symbols`;

			try {
				const resp = await fetch(url);

				if (resp.status === 200) {
					const json = await resp.json();

					// Set array of symbols into localStorage
					localStorage.setItem("symbols", JSON.stringify(json));

					// Load the array into state
					this.setState({ symbols: json })
				}

				if (resp.status === 500) {
					this.setState({ error: true })
				}
			} catch (err) {
				this.setState({ error: true })
			}
		}

		// Check if localStorage has companies in store
		if (!localStorage.getItem("companies")) {

			// Get the list of companies from the server
			const url = `${process.env.REACT_APP_SERVER_DOMAIN}/api/companies`;

			try {
				const resp = await fetch(url);

				if (resp.status === 200) {
					const json = await resp.json();

					// Set array of companies into localStorage
					localStorage.setItem("companies", JSON.stringify(json));

					// Load the array into state
					this.setState({ companies: json })
				}

				if (resp.status === 500) {
					this.setState({ error: true })
				}
			} catch (err) {
				this.setState({ error: true })
			}
		}

		// Set data into state
		this.setState({
			symbols: JSON.parse(localStorage.getItem("symbols")),
			companies: JSON.parse(localStorage.getItem("companies"))
		}, () => {

			// Default will be search by symbol
			this.setState({
				data: this.state.symbols,
				dataType: "symbol"
			})
		})
	}

	// Get the symbol for the selected company
	async getSymbolForCompany(company) {
		const url = `${process.env.REACT_APP_SERVER_DOMAIN}/api/convert/company/${company}`;

		try {
			const resp = await fetch(url);
			if (resp.status === 200) {
				const symbol = await resp.json();
				return symbol;
			}

			if (resp.status === 500) {
				this.setState({ error: true });
			}
		} catch (err) {
			this.setState({ error: true });
		}
	}

	componentDidMount() {
		this.prepareSearchbar();
	}

	render() {
		// Check for error from server
		if (this.state.error) {
			return <Error message={"There has been an error. Please try again later!"} />;
		}

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
						<ToggleButtonGroup id="toggleGroup" type="radio" name="search-option" defaultValue={1} onChange={this.toggleChange}>
							<ToggleButton variant="info" value={1}>Symbol</ToggleButton>
							<ToggleButton variant="info" value={2}>Company</ToggleButton>
						</ToggleButtonGroup>
						<Typeahead id="searchInput" className="mr-sm-2" onChange={this.handleChange} options={this.state.data} flip={true} placeholder={this.state.searchText} />
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
							<ToggleButtonGroup id="toggleGroup" type="radio" name="search-option" defaultValue={1} onChange={this.toggleChange}>
								<ToggleButton variant="info" value={1}>Symbol</ToggleButton>
								<ToggleButton variant="info" value={2}>Company</ToggleButton>
							</ToggleButtonGroup>
							<Typeahead id="searchInput" className="mr-sm-2" onChange={this.handleChange} options={this.state.data} flip={true} placeholder={this.state.searchText} />
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
