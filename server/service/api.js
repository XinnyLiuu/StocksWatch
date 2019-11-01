'use strict';
const axios = require('axios');
const APIException = require('../exceptions/APIException');

// API Keys + URLs
const INTRINIO_KEY = process.env.INTRINIO_KEY;
const IEX_KEY = process.env.IEX_KEY;

const INTRINIO_URL = process.env.INTRINIO_URL;
const IEX_URL = process.env.IEX_URL;

/**
 * GET /api/dow30
 * 
 * Gets all stock data of dow 30
 */
exports.getStockDataForDow = (req, res) => {
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
    let result = { "DOW30": [] };
    let intrinio;

    // Iterate through each dow symbol and query intrinio for the data
    let getDow = new Promise((resolve, reject) => {
        dow.forEach(symbol => {
            intrinio = `${INTRINIO_URL}/${symbol}/prices?api_key=${INTRINIO_KEY}`;

            // Use axios to hit the intrinio endpoint 
            axios.get(intrinio).then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    const json = parseData(data);
                    result.DOW30.push(json);

                    if (result.DOW30.length === 30) {
                        resolve();
                    }
                }
            }).catch(err => {
                reject(err);
            })
        });
    });

    getDow.then(() => {
        return res.json(result);
    }).catch(err => {
        try {
            if (err) throw new APIException("Error in api service", err);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    })

    // Parse the data returned from intrinio and return as a json
    function parseData(data) {
        let json = {
            "symbol": data.security.ticker,
            "prices": {
                "high": [], // [date, high]
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

/**
 * GET /api/monthly/:stock
 * 
 * Gets data for a specified stock
 */
exports.getStockDataBySymbol = (req, res) => {
    const symbol = req.params.symbol;

    // Build URL
    let monthly_data_url = IEX_URL;
    monthly_data_url += `/${symbol}/chart/1y`;
    monthly_data_url += `?token=${IEX_KEY}`;

    axios.get(monthly_data_url).then(result => {
        // Check response status
        if (result.status === 200) {
            const data = result.data;
            const json = parseData(data, symbol);

            return res.json(json);
        }
    }).catch(err => {
        try {
            if (err) throw new APIException("Error in api service", err);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    });

    function parseData(data, s) {
        let json = {
            "symbol": s,
            "prices": {
                "high": [], // [date, high]
                "low": [] // [date, low]
            }
        };

        data.forEach(p => {
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

        json.prices.high.reverse();
        json.prices.low.reverse();

        return json;
    }
}

/**
 * POST /api/watchlist/stocks
 * 
 * Receives a list of the user's watchlists from client and queries them through intrinio, aggregate the data and return it to the client
 */
exports.postWatchlistStocks = (req, res) => {
    let watchlist = JSON.parse(req.body.watchlist);

    let results = {
        "watchlist": []
    };

    // Iterate through every symbol in the user's watchlist
    let getWatchlist = new Promise((resolve, reject) => {
        if (watchlist.length > 0) {
            watchlist.forEach(s => {
                // Build URL
                let monthly_data_url = IEX_URL;
                monthly_data_url += `/${s}/chart/1y`;
                monthly_data_url += `?token=${IEX_KEY}`;

                axios.get(monthly_data_url).then(result => {
                    // Check response status
                    if (result.status === 200) {
                        const data = result.data;
                        const json = parseData(data, s);
                        results.watchlist.push(json);

                        // Check the length of results.watchlist and watchlist
                        if (watchlist.length === results.watchlist.length) {
                            resolve();
                        }
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        }
    });

    getWatchlist.then(() => {
        return res.json(results);
    }).catch(err => {
        try {
            if (err) throw new APIException("Error in api service", err);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    })

    function parseData(data, s) {
        let json = {
            "symbol": s,
            "prices": {
                "high": [], // [date, high]
                "low": [] // [date, low]
            }
        };

        data.forEach(p => {
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

        json.prices.high.reverse();
        json.prices.low.reverse();

        return json;
    }
}

/**
 * Sends a HEAD request to IEX to see if the stock exists 
 */
exports.checkValidStock = (stock) => {
    let monthly_data_url = IEX_URL;
    monthly_data_url += `/${stock}/chart/1y`;
    monthly_data_url += `?token=${IEX_KEY}`;

    return new Promise((resolve, reject) => {
        axios.head(monthly_data_url).then(result => {
            if (result.status === 200) {
                resolve();
            }
        }).catch(err => {
            reject(err);
        })
    })
}