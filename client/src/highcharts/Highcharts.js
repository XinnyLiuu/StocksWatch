import React from 'react';

class Highcharts extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            symbol: null,
            timezone: null,
            prices: null
        };
    }

    getMonthlyDataForStock() {
        const stock = this.props.stock;
        const api = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/monthly/${stock}`; 

        // Fire GET to /api/monthly/:stock        
        fetch(api)
            .then(resp => {
                if(resp.status === 200) {
                    resp.json().then(data => {
                        this.setState({ 
                            symbol: data.symbol,
                            timezone: data.timezone, 
                            prices: data.prices
                        });
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    // getPrices() {
    //     let prices = this.state.prices;
    //     let pricePTags = [];

    //     prices.forEach(p => {
    //     })
    // }

    componentDidMount() {
        this.getMonthlyDataForStock();
    }

    render() {
        return (
            <React.Fragment>
                <h1>{ this.state.symbol }</h1>
                <h2>{ this.state.timezone }</h2>
                <p> { JSON.stringify(this.state.prices) }</p>
            </React.Fragment>
        )
    }
}

export default Highcharts;