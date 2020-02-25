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
			searchText: "Select a Symbol", // Text for the searchInput 
			searchValue: '', // Value to be searched
			searchDisabled: true
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
		if (event[0] !== undefined) {
			// Encode the value since it will be used in the URL
			this.setState({
				searchValue: encodeURIComponent(event[0])
			}, () => {

				// Check that a search value is provided
				if (this.state.searchValue !== undefined) this.setState({ searchDisabled: false });
			});
		}
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
				searchText: "Select a Symbol",
				data: this.state.symbols,
				dataType: "symbol",
				searchValue: ""
			})
		}

		if (event === 2) {
			// Company
			this.setState({
				searchText: "Select a Company",
				data: this.state.companies,
				dataType: "company",
				searchValue: ""
			})
		}
	}

	// Grabs the list of symbol / companies to search for
	async prepareSearchbar() {
		// Check if localStorage has symbols in store
		if (!localStorage.getItem("symbols")) {

			// Get the list of symbols from the server
			const url = `${process.env.REACT_APP_get_symbols_url}`;

			try {
				const resp = await fetch(url);

				if (resp.status === 200) {
					const json = await resp.json();

					// Set array of symbols into localStorage
					localStorage.setItem("symbols", JSON.stringify(json));

					// Load the array into state
					this.setState({ symbols: json })
				}

				if (resp.status === 500) throw new Error();
			} catch (err) {
				this.props.history.push("/NotFound");
			}
		}

		// Check if localStorage has companies in store
		if (!localStorage.getItem("companies")) {

			// Get the list of companies from the server
			const url = `${process.env.REACT_APP_get_companies_url}`;

			try {
				const resp = await fetch(url);

				if (resp.status === 200) {
					const json = await resp.json();

					// Set array of companies into localStorage
					localStorage.setItem("companies", JSON.stringify(json));

					// Load the array into state
					this.setState({ companies: json })
				}
			} catch (err) {
				this.props.history.push("/NotFound");
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
		const url = `${process.env.REACT_APP_get_symbol_by_company_url}${company}`;

		try {
			const resp = await fetch(url);

			if (resp.status === 200) {
				const symbol = await resp.json();
				return symbol;
			}

			if (resp.status === 500) throw new Error();
		} catch (err) {
			this.props.history.push("/NotFound");
		}
	}

	// Fires when form is submitted
	async searchStock(e) {
		e.preventDefault();

		// Check the data type of the value entered into the search bar
		if (this.state.dataType === "company") {
			try {
				const symbol = await this.getSymbolForCompany(this.state.searchValue);

				this.setState({
					searchValue: symbol,
					searchDisabled: true
				})
			} catch (err) {
				this.props.history.push("/NotFound");
			}
		}

		// Update `url` flag in state
		this.setState({
			url: `/search/${this.state.searchValue}`,
			searchValue: "",
			searchDisabled: true
		}, () => this.props.history.push(this.state.url));
	}

	// On click, log the user out
	logout() {
		destroySession();

		// Redirect to home
		this.props.history.push("/");
	}

	componentDidMount() {
		this.prepareSearchbar();
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
						<ToggleButtonGroup id="toggleGroup" type="radio" name="search-option" defaultValue={1} onChange={this.toggleChange}>
							<ToggleButton variant="outline-info" value={1}>Symbol</ToggleButton>
							<ToggleButton variant="outline-info" value={2}>Company</ToggleButton>
						</ToggleButtonGroup>
						<Typeahead id="searchInput" className="mr-sm-2" onChange={this.handleChange} options={this.state.data} flip={true} placeholder={this.state.searchText} value={this.state.searchValue} />
						<Button id="searchBtn" variant="outline-info" type="submit" disabled={this.state.searchDisabled}>Search</Button>
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
							<Nav.Link href="/dow30">Dow 30</Nav.Link>
							<Nav.Link href="/watchlist">Watchlist</Nav.Link>
							<Nav.Link href="/settings">Settings</Nav.Link>
							<Nav.Link onClick={this.logout} href="/">Logout</Nav.Link>
						</Nav>
						<Form inline onSubmit={this.searchStock}>
							<ToggleButtonGroup id="toggleGroup" type="radio" name="search-option" defaultValue={1} onChange={this.toggleChange}>
								<ToggleButton variant="outline-info" value={1}>Symbol</ToggleButton>
								<ToggleButton variant="outline-info" value={2}>Company</ToggleButton>
							</ToggleButtonGroup>
							<Typeahead id="searchInput" className="mr-sm-2" onChange={this.handleChange} options={this.state.data} flip={true} placeholder={this.state.searchText} value={this.state.searchValue} />
							<Button id="searchBtn" variant="outline-success" type="submit" disabled={this.state.searchDisabled}>Search</Button>
						</Form>
					</Navbar.Collapse>
				</Navbar>
			);
		}

		return navbar;
	}
}

export default withRouter(Header);
