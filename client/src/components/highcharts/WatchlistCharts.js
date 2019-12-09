import React from 'react';
import StockChart from './StockChart';
import LoadingSpinner from './LoadingSpinner';
import Unavailable from '../alert/Unavailable';
import Info from "../alert/Info";

import {
	post
} from "../../utils/requests";

class WatchlistCharts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			watchlist: [],
			data: "",
			error: false
		};
	}

	/**
	 * Sends a request to the server to retrieve all the user's stocks' data
	 */
	async fetchData() {
		// Prepare data and url
		const api = this.props.api;
		const data = JSON.stringify(
			{ "watchlist": localStorage.getItem("stocks") }
		);

		try {
			const resp = await post(api, data);

			// Check HTTP status code
			if (resp.status === 200) {
				const json = await resp.json();
				this.setState({ data: json });
			}

			if (resp.status === 500) this.setState({ error: true });
		} catch (err) {
			this.setState({ error: true })
		}
	}

	componentDidMount() {
		// Get the stocks of the user in localStorage 
		const stocks = JSON.parse(localStorage.getItem('stocks'));

		this.setState({
			watchlist: stocks
		}, () => this.fetchData());
	}

	render() {
		// Determine the message to show in the alert
		const message = (this.state.watchlist.length === 0 ?
			<p>Your watchlist is currently empty! Go <a href='/watchlist'>here</a> to add to your watchlist</p> :
			<p>Go <a href='/watchlist'>here</a> to update your watchlist</p>
		);

		// Alert
		const alert = (
			<React.Fragment>
				{this.state.error ?
					<Unavailable message={"Could not load your watchlist at this time!"} /> :
					<Info header={"Your Watchlist"} message={message} />
				}
			</React.Fragment>
		)

		// Check if the user has stocks listed in their watchlist and that data has been retreived
		if (this.state.watchlist.length > 0 &&
			this.state.data !== "") {

			// Get the data retrieved from the server
			let json = this.state.data;

			if (json.hasOwnProperty("watchlist")) {
				let charts = [];
				charts.push(alert);

				// For each stock in the user's watchlist, generate a chart for it
				let watchlist = json["watchlist"];

				watchlist.forEach(d => {
					charts.push(<StockChart data={d} type="multiple" />);
				});

				return charts;
			}
		}

		// Show alert message to let users know about adding to watchlist
		if (this.state.watchlist.length === 0) {
			return alert;
		}

		// Default to render a spinner
		return <LoadingSpinner />;
	}
}

export default WatchlistCharts;