import React from 'react';
import StockChart from './StockChart';

class Wrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: ""
        };
    }

    fetchData() {
        const flag = this.props.flag;
        const api = this.props.api;

        // Check the flag 
        if (flag === "dow30") {
            // GET data from server
            fetch(api)
                .then(resp => {
                    // On 200 status
                    if (resp.status === 200) {
                        resp.json()
                            .then(data => {
                                // Set the data returned from fetch in state
                                this.setState({
                                    data: data
                                })
                            })
                    }
                })
                .catch(err => {
                    // TODO: Error handling in React
                    console.log(err);
                })
        }
        else if (flag === "single") {
            // GET data from server
            fetch(api)
                .then(resp => {
                    // On 200 status
                    if (resp.status === 200) {
                        resp.json()
                            .then(data => {
                                // Set the data returned from fetch in state
                                this.setState({
                                    data: data
                                })
                            })
                    }
                })
                .catch(err => {
                    // TODO: Error handling in React
                    console.log(err);
                })
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        // Check if data in state is still an empty string
        if (this.state.data !== "") {
            let json = this.state.data;

            // Check if json is DOW30
            if (json.hasOwnProperty("DOW30")) {
                let stockCharts = []; // Array of StockChart components

                let dow = json["DOW30"];
                dow.forEach(d => {
                    stockCharts.push(<StockChart data={d} />);
                });

                return stockCharts;
            }
            else {
                return <StockChart data={json} />;
            }
        }

        return <h1>Loading please wait ...</h1>;
    }
}

export default Wrapper;