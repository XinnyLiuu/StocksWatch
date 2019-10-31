import React from 'react';
import StockChart from './StockChart';
import LoadingSpinner from './LoadingSpinner';
import {
	Alert
} from 'react-bootstrap';

class Wrapper extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: ""
		};
	}

	fetchData() {
		// Get props
		const api = this.props.api + "/" + this.props.symbol;

		// GET data from server
		fetch(api).then(resp => {
			// On 200 status
			if (resp.status === 200) {
				resp.json().then(data => {
					// Set the data returned from fetch in state
					this.setState({
						data: data
					})
				}).catch(err => {
					console.log(err);
				})
			}
		}).catch(err => {
			console.log(err);
		})
	}

	componentDidMount() {
		// Grab the data from the server to render the graphs in the component
		this.fetchData();
	}

	componentDidUpdate(prevProps) {
		// Check if symbol has changed
		if (prevProps.symbol !== this.props.symbol) {
			this.fetchData();
		}
	}

	render() {
		// Check if data in state is still an empty string
		if (this.state.data !== "") {
			let json = this.state.data;

			// Check if json is DOW30
			if (json.hasOwnProperty("DOW30")) {
				let stockCharts = [];
				let dow = json["DOW30"];

				stockCharts.push(
					<Alert variant="info">
						<Alert.Heading>Dow 30</Alert.Heading>
						<p>Login or Register to build your personalized watchlist</p>
					</Alert>
				)

				// Render each DOW stock as its own StockChart component
				dow.forEach(d => {
					stockCharts.push(<StockChart data={d} type="multiple" />);
				});

				return stockCharts;
			}
			// Else, the json passed into the component is data for only one stock
			else {
				return <StockChart data={json} type="single" />;
			}
		}

		// Temporary DOM element until the date is ready
		return <LoadingSpinner />
	}
}

export default Wrapper;
