import React from 'react';
import {
	ButtonToolbar,
	Button
} from 'react-bootstrap';

import StockChart from './StockChart';
import LoadingSpinner from '../LoadingSpinner';
import Unavailable from '../alert/Unavailable';
import Info from '../alert/Info';

import { isAuthenticated } from '../../utils/auth';
import { post } from "../../utils/requests";

class Wrapper extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: "",
			error: false,
			btnDisable: false,
			btnText: "Add to Watchlist"
		};

		this.addUserStock = this.addUserStock.bind(this);
		this.checkStockInWatchlist = this.checkStockInWatchlist.bind(this);
	}

	// Grabs the data for the stock
	async fetchData() {
		// Get props
		const api = this.props.api + "/" + this.props.symbol;

		// GET data from server
		try {
			const resp = await fetch(api);

			// On 200 status
			if (resp.status === 200) {
				const json = await resp.json();

				// Set the data returned from fetch in state
				this.setState({
					data: json,
					error: false
				})
			}

			// On 500 status
			if (resp.status === 500) this.setState({ error: true });
		} catch (err) {
			this.setState({ error: true })
		}
	}

	// Adds the stock to the user watchlist
	async addUserStock(e) {
		e.preventDefault();

		// Get values
		const stock = this.props.symbol;
		const userId = localStorage.getItem("id");
		const username = localStorage.getItem("username");

		// Prepare url and data
		const url = `${process.env.REACT_APP_SERVER_DOMAIN}/api/user/watchlist`;
		const data = JSON.stringify({
			"userId": userId,
			"stock": stock,
			"username": username
		})

		try {
			const resp = await post(url, data);

			// On 200 status
			if (resp.status === 200) {
				const json = await resp.json();

				// Add stock to localStorage / session
				let symbol = json.symbol;
				let stocks = JSON.parse(localStorage.getItem("stocks"));
				stocks.push(symbol);
				stocks = JSON.stringify(stocks);
				localStorage.setItem("stocks", stocks);

				// Update state
				this.setState({
					btnDisable: true,
					btnText: "Added!"
				})
			}

			// On 500 status
			if (resp.status === 500) this.setState({ error: true });
		} catch (err) {
			this.setState({ error: true });
		}
	}

	// Check if the stock exists in localStorage 'stocks'
	checkStockInWatchlist(e) {
		if (this.props.symbol !== "") {
			if (localStorage.getItem("stocks")) {
				const stocks = JSON.parse(localStorage.getItem("stocks"));

				if (stocks.includes(this.props.symbol)) {
					this.setState({
						btnDisable: true,
						btnText: "Added!"
					})
				}
			}
		}
	}

	componentDidMount() {
		this.fetchData();
		this.checkStockInWatchlist();
	}

	/**
	 * Since this component is used repeatedly as a "wrapper" for loading single graphs, on a new /search/:symbol reload the data 
	 */
	componentDidUpdate(prevProps) {
		// Check if symbol has changed
		if (prevProps.symbol !== this.props.symbol) {

			// Reset button states
			this.setState({
				btnDisable: false,
				btnText: "Add to Watchlist"
			});

			this.fetchData();
			this.checkStockInWatchlist();
		}
	}

	render() {
		// Check for error from server
		if (this.state.error) return <Unavailable message={"There is an error getting the data for that stock!"} />;

		// Check if data in state is still an empty string
		if (this.state.data !== "") {
			let json = this.state.data;

			// Check if json has DOW30
			if (json.hasOwnProperty("DOW30")) {
				let stockCharts = [];
				let dow = json["DOW30"];

				// Check if the user is authenticated to determine dow30 message
				let message = "Login or Register to build your personalized watchlist";

				if (isAuthenticated()) message = "Companies in the Dow Jones Industrial Average";

				stockCharts.push(
					<Info header={"Dow 30"} message={message} />
				);

				// Render each DOW stock as its own StockChart component
				dow.forEach(d => stockCharts.push(<StockChart data={d} type="multiple" />));

				return stockCharts;
			}

			// If the json does not have DOW30, then its a single stock
			// Check if the user is logged in
			if (isAuthenticated()) {
				return (
					<React.Fragment>
						<StockChart data={json} type="single" />
						<br />
						<ButtonToolbar className="center">
							<Button variant="success" onClick={this.addUserStock} disabled={this.state.btnDisable}>{this.state.btnText}</Button>
						</ButtonToolbar>
					</React.Fragment>
				);
			}

			// Default is to render the chart for the single stock
			return <StockChart data={json} type="single" />;
		}

		// Temporary DOM element until the date is ready
		return <LoadingSpinner />;
	}
}

export default Wrapper;
