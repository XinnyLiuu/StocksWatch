import React from 'react';
import {
    Form,
    Button,
    Card,
    ListGroup
} from 'react-bootstrap';

class Watchlist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stock: '',
            prevStocks: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.addUserStock = this.addUserStock.bind(this);
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
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }

    // TODO: Delete stock from watchlist

    render() {
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
                lists.push(<ListGroup.Item variant="info">{s}</ListGroup.Item>);
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