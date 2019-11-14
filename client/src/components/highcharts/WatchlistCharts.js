import React from 'react';
import StockChart from './StockChart';
import LoadingSpinner from './LoadingSpinner';
import Unavailable from '../alert/Unavailable';
import {
    Alert
} from 'react-bootstrap';

class WatchlistCharts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            watchlist: [],
            data: "",
            error: false
        };
    }

    async fetchData() {
        const api = this.props.api;

        try {
            // Send a POST to server, so that server can query for the stock(s) data
            const resp = await fetch(api, {
                method: 'POST',
                mode: 'cors',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    { "watchlist": localStorage.getItem("stocks") }
                )
            });

            // Check HTTP status code
            if (resp.status === 200) {
                const json = await resp.json();

                this.setState({
                    data: json
                });
            }

            if (resp.status === 500) {
                this.setState({
                    error: true
                });
            }

        } catch (err) {
            this.setState({
                error: true
            })
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
        // Check if the user has stocks listed in their watchlist
        if (this.state.watchlist.length > 0 && this.state.data !== "") {
            let json = this.state.data;

            if (json.hasOwnProperty("watchlist")) {
                let charts = [];
                let watchlist = json["watchlist"];

                watchlist.forEach(d => {
                    charts.push(<StockChart data={d} type="multiple" />);
                });

                return charts;
            }
        }

        // Show alert message to let users know about adding to watchlist
        if (this.state.watchlist.length === 0) {
            return (
                <Alert variant="warning">
                    <Alert.Heading>Your watchlist is empty!</Alert.Heading>
                    <p>
                        Go <a href="/watchlist">here</a> to start building your watchlist
                    </p>
                </Alert>
            )
        }

        // Check for error from server
        if (this.state.error) {
            return <Unavailable />;
        }

        // Default to render a spinner
        return <LoadingSpinner />;
    }
}

export default WatchlistCharts;