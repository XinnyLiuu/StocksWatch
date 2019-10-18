'use strict';
const axios = require('axios');

/** 
 * The following uses Intrinio's API to query the Dow 30's data
 */
const API_KEY = process.env.INTRINIO_KEY;
const URL = process.env.INTRINIO_URL;

// Get symbols of all 30 companies
const dow = [
    "AAPL",
    "AXP",
    "BA",
    "CAT",
    "CSCO",
    "CVX",
    "DIS",
    "DWDP",
    "GE",
    "GS",
    "HD",
    "IBM",
    "INTC",
    "JNJ",
    "JPM",
    "KO",
    "MCD",
    "MMM",
    "MRK",
    "MSFT",
    "NKE",
    "PFE",
    "PG",
    "TRV",
    "UNH",
    "UTX",
    "V",
    "VZ",
    "WMT",
    "XOM"
];

/**
 * Gets all stock data of all dow 30 using symbol
 */
exports.getStockDataForDow = (req, res) => {
    let result = {
        "DOW30": []
    };
    let intrinio;

    // Iterate through each dow symbol and query intrinio for the data
    dow.forEach(symbol => {
        intrinio = `${URL}/${symbol}/prices?api_key=${API_KEY}`;

        // Use axios to hit the intrinio endpoint 
        axios.get(intrinio)
            .then(response => {
                if (response.status === 200) {
                    const data = response.data;

                    const json = parseData(data);
                    result.DOW30.push(json);

                    if (result.DOW30.length === 30) {
                        console.log(result.DOW30);

                        res.setHeader("Content-Type", "application/json");
                        return res.send(result);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
    });

    // Parse the data returned from intrinio and return as a json
    function parseData(data) {
        let json = {
            "symbol": data.security.ticker,
            "prices": {
                "high": [], // [date, higi]
                "low": [] // [date, low]
            }
        };

        let prices = data.stock_prices;
        prices.forEach(p => {
            let date = new Date(p.date).getTime();

            let high_arr = [];
            let low_arr = [];

            high_arr.push(date);
            high_arr.push(p.high);

            low_arr.push(date);
            low_arr.push(p.low);

            json.prices.high.push(high_arr);
            json.prices.low.push(low_arr);
        });

        return json;
    }
}



