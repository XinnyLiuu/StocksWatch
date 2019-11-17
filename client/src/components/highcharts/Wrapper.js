import React from 'react';
import StockChart from './StockChart';
import LoadingSpinner from './LoadingSpinner';
import Unavailable from '../alert/Unavailable';
import Info from '../alert/Info';

class Wrapper extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: "",
			error: false
		};
	}

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
			if (resp.status === 500) {
				this.setState({ error: true });
			}
		} catch (err) {
			this.setState({ error: true })
		}
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
		// Check for error from server
		if (this.state.error) {
			return <Unavailable message={"There is an error getting the data for that stock!"} />;
		}

		// Check if data in state is still an empty string
		if (this.state.data !== "") {
			let json = this.state.data;

			// Check if json is DOW30
			if (json.hasOwnProperty("DOW30")) {
				let stockCharts = [];
				let dow = json["DOW30"];

				stockCharts.push(
					<Info header={"Dow 30"} message={"Login or Register to build your personalized watchlist"} />
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
		return <LoadingSpinner />;
	}
}

export default Wrapper;
