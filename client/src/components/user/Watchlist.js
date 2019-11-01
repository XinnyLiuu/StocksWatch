import React from 'react';
import {
    Form,
    Button,
    Card,
    ListGroup
} from 'react-bootstrap';

import GenericError from '../error/GenericError';
import '../../css/main.css';

class Watchlist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stock: '',
            prevStocks: [],
            error: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.addUserStock = this.addUserStock.bind(this);
        this.deleteUserStock = this.deleteUserStock.bind(this);
    }

    handleChange(e) {
        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
        // Get the stocks of the user in localStorage 
        const stocks = JSON.parse(localStorage.getItem('stocks'));

        if (stocks.length > 0) {
            this.setState({
                prevStocks: stocks
            })
        }
    }

    // Takes the inputted stock and POSTs it to the server
    addUserStock(e) {
        e.preventDefault();

        // Validate
        let stock = this.state.stock;
        let userId = localStorage.getItem("id");
        stock = stock.trim().toUpperCase();

        // Fire POST 
        let url = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/watchlist/add`;

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "userId": userId,
                "stock": stock
            })
        }).then(resp => {
            if (resp.status === 200) {
                resp.json().then(resp => {
                    // Add stock to localStorage / session
                    let symbol = resp.symbol;

                    let stocks = JSON.parse(localStorage.getItem("stocks"));
                    stocks.push(symbol);

                    stocks = JSON.stringify(stocks);
                    localStorage.setItem("stocks", stocks);

                    // Update state
                    this.setState({
                        prevStocks: JSON.parse(localStorage.getItem('stocks'))
                    })
                }).catch(err => {
                    this.setState({
                        error: true
                    });
                })
            }

            if (resp.status === 500) {
                this.setState({
                    error: true
                });
            }
        }).catch(err => {
            this.setState({
                error: true
            });
        })
    }

    deleteUserStock(e) {
        e.preventDefault();

        // Validate
        let stock = e.target.dataset.stock;
        let userId = localStorage.getItem("id");
        stock = stock.trim().toUpperCase();

        // Fire DELETE
        let url = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/watchlist/remove`;

        fetch(url, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "userId": userId,
                "stock": stock
            })
        }).then(resp => {
            if (resp.status === 200) {
                resp.json().then(resp => {
                    // Remove stock from localStorage / session
                    let symbol = resp.symbol;
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
                }).catch(err => {
                    this.setState({
                        error: true
                    });
                })
            }

            if (resp.status === 500) {
                this.setState({
                    error: true
                });
            }
        }).catch(err => {
            this.setState({
                error: true
            });
        })
    }


    render() {
        // Check if error
        if (this.state.error) {
            return <GenericError />;
        }

        let watchlist = (
            <Form onSubmit={this.addUserStock}>
                <Form.Group>
                    <Form.Label>Stock</Form.Label>
                    <Form.Control type="text" name="stock" placeholder="Enter a Stock Ticker Symbol" onChange={this.handleChange} />
                </Form.Group>

                <Button variant="info" type="submit">
                    Add
                </Button>
            </Form>
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