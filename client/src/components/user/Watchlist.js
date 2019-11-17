import React from 'react';
import {
    Form,
    Button,
    Card,
    ListGroup,
    ToggleButton,
    ToggleButtonGroup
} from 'react-bootstrap';
import { Typeahead } from "react-bootstrap-typeahead"; // http://ericgio.github.io/react-bootstrap-typeahead/#top

import Error from '../alert/Error';

class Watchlist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: "Search by Symbol", // Text for the searchInput, 
            searchValue: '', // Value to be searched
            prevStocks: [],
            symbols: [],
            companies: [],
            data: [],
            dataType: '', // Type of data - symbol or company
            error: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.addUserStock = this.addUserStock.bind(this);
        this.deleteUserStock = this.deleteUserStock.bind(this);
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

    // Takes the inputted stock and POSTs it to the server
    async addUserStock(e) {
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

        // Validate
        let stock = this.state.searchValue;
        let userId = localStorage.getItem("id");

        // Fire POST 
        let url = `${process.env.REACT_APP_SERVER_DOMAIN}/api/watchlist/add`;

        try {
            const resp = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "userId": userId,
                    "stock": stock
                })
            });

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
                    prevStocks: JSON.parse(localStorage.getItem('stocks'))
                })
            }

            // On 500 status
            if (resp.status === 500) {
                this.setState({ error: true });
            }
        } catch (err) {
            this.setState({ error: true });
        }
    }

    async deleteUserStock(e) {
        e.preventDefault();

        // Validate
        let stock = e.target.dataset.stock;
        let userId = localStorage.getItem("id");

        // Fire DELETE
        let url = `${process.env.REACT_APP_SERVER_DOMAIN}/api/watchlist/remove`;

        try {
            const resp = await fetch(url, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "userId": userId,
                    "stock": stock
                })
            });

            // On 200 status
            if (resp.status === 200) {
                const json = await resp.json();

                // Remove stock from localStorage / session
                let symbol = json.symbol;
                let stocks = JSON.parse(localStorage.getItem("stocks"));

                // Remove 
                for (let i = 0; i < stocks.length; i++) {
                    if (stocks[i] === symbol) {
                        stocks.splice(i, 1);
                    }
                }

                stocks = JSON.stringify(stocks);
                localStorage.setItem("stocks", stocks);

                // Update state
                this.setState({
                    prevStocks: JSON.parse(localStorage.getItem('stocks'))
                })
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

        // Get the stocks of the user in localStorage 
        const stocks = JSON.parse(localStorage.getItem('stocks'));

        if (stocks.length > 0) {
            this.setState({
                prevStocks: stocks
            })
        }
    }

    render() {
        // Check if error
        if (this.state.error) {
            return <Error message={"There has been an error. Please try again later!"} />;
        }

        let watchlist = (
            <React.Fragment>
                <Form.Label>Add to Watchlist</Form.Label>
                <Form inline onSubmit={this.addUserStock}>

                    <Form.Group>
                        <Typeahead id="watchlistInput" onChange={this.handleChange} options={this.state.data} flip={true} placeholder={this.state.searchText} />
                        <ToggleButtonGroup id="toggleGroupWatchlist" type="radio" name="search-option" defaultValue={1} onChange={this.toggleChange}>
                            <ToggleButton variant="info" value={1}>Symbol</ToggleButton>
                            <ToggleButton variant="info" value={2}>Company</ToggleButton>
                        </ToggleButtonGroup>
                    </Form.Group>

                    <Button variant="info" type="submit">
                        Add
                    </Button>
                </Form>
            </React.Fragment>
        );

        // If there are stocks in the user's watchlist already, show them here
        if (this.state.prevStocks instanceof Array && this.state.prevStocks.length > 0) {
            // Build the component(s) to be rendered
            let temp = watchlist;
            watchlist = [];
            watchlist.push(temp);

            // Each stock in prevStocks will exist in a ListGroup component
            let lists = [];
            this.state.prevStocks.forEach(s => {
                lists.push(
                    <React.Fragment>
                        <ListGroup.Item variant="info">
                            <span>{s}</span>
                            <span className="float-right">
                                <Button data-stock={s} variant="danger" size="sm" onClick={this.deleteUserStock}>Remove</Button>
                            </span>
                        </ListGroup.Item>
                    </React.Fragment>
                );
            });

            // Add the lists to a Card component
            let card = (
                <React.Fragment>
                    <br />
                    <Form.Label>Currently Watched Stocks</Form.Label>
                    <Card bg="info">
                        <ListGroup variant="flush">
                            {lists}
                        </ListGroup>
                    </Card>
                </React.Fragment>
            );

            watchlist.push(card);
            watchlist = (
                <div id="watchlist">
                    {watchlist}
                </div>
            );

            return watchlist;
        }

        return (
            <div id="watchlist">
                {watchlist}
            </div>
        );
    }
}

export default Watchlist;