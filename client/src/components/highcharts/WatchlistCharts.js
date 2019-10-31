import React from 'react';
import StockChart from './StockChart';
import LoadingSpinner from './LoadingSpinner';
import {
    Alert
} from 'react-bootstrap';

class WatchlistCharts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            watchlist: [],
            data: ""
        };
    }

    fetchData() {
        // Send a POST to server, so that server can query Alpha Vantage API and then send back the data
        const api = this.props.api;

        fetch(api, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "watchlist": localStorage.getItem("stocks")
            })
        }).then(resp => {
            resp.json().then(resp => {
                // Set state
                this.setState({
                    data: resp
                });
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }

    componentDidMount() {
        // Get the stocks of the user in localStorage 
        const stocks = JSON.parse(localStorage.getItem('stocks'));

        this.setState({
            watchlist: stocks
        }, () => {
            this.fetchData();
        })
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

        // Default to render a spinner
        return <LoadingSpinner />;
    }
}

export default WatchlistCharts;