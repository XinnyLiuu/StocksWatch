'use strict';
const axios = require('axios');

const parser = require("../utils/parser");

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
exports.getStockDataForDow = async (req, res) => {
    const dow = ["AAPL", "AXP", "BA", "CAT", "CSCO", "CVX", "DIS", "DWDP", "GE", "GS", "HD", "IBM", "INTC", "JNJ", "JPM", "KO", "MCD", "MMM", "MRK", "MSFT", "NKE", "PFE", "PG", "TRV", "UNH", "UTX", "V", "VZ", "WMT", "XOM"];
    let result = { "DOW30": [] };
    let intrinio;

    // Iterate through each dow symbol and query intrinio for the data
    let getDow = new Promise((resolve, reject) => {
        dow.forEach(symbol => {
            intrinio = `${INTRINIO_URL}/${symbol}/prices?api_key=${INTRINIO_KEY}`;

            // Use axios to hit the intrinio endpoint
            axios.get(intrinio).then(resp => {
                if (resp.status === 200) {
                    const data = resp.data;
                    const json = parser.intrinioParser(data);
                    result.DOW30.push(json);

                    if (result.DOW30.length === 30) {
                        resolve(true);
                    }
                }
            }).catch(err => {
                console.log(err);
                reject(err);
            })
        });
    });

    // Check if dow data has been fetched
    try {
        const fetched = await getDow;

        if (fetched) return res.json(result);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * GET /api/monthly/:stock
 * 
 * Gets data for a specified stock
 */
exports.getStockDataBySymbol = async (req, res) => {
    const symbol = req.params.symbol;

    // Build URL
    let yearly_data_url = IEX_URL;
    yearly_data_url += `/${symbol}/chart/1y`;
    yearly_data_url += `?token=${IEX_KEY}`;

    try {
        let result = await axios.get(yearly_data_url);

        if (result.status === 200) {
            let data = result.data;
            const json = parser.IEXParser(data, symbol);

            // Get the stock's company name + current price
            let current_data_url = IEX_URL;
            current_data_url += `/${symbol}/quote`;
            current_data_url += `?token=${IEX_KEY}`;

            result = await axios.get(current_data_url);

            if (result.status === 200) {
                data = result.data;
                json["company"] = data.companyName;
                json["currentPrice"] = data.latestPrice;
            }

            return res.json(json);
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * POST /api/watchlist/stocks
 * 
 * Receives a list of the user's watchlists from client and queries them through intrinio, aggregate the data and return it to the client
 */
exports.postWatchlistStocks = async (req, res) => {
    let watchlist = JSON.parse(req.body.watchlist);
    let results = { "watchlist": [] };

    // Iterate through every symbol in the user's watchlist
    let getWatchlist = new Promise((resolve, reject) => {
        if (watchlist.length > 0) {
            watchlist.forEach(s => {
                // Build URLs
                let yearly_data_url = IEX_URL;
                yearly_data_url += `/${s}/chart/1y`;
                yearly_data_url += `?token=${IEX_KEY}`;

                let current_data_url = IEX_URL;
                current_data_url += `/${s}/quote`;
                current_data_url += `?token=${IEX_KEY}`;

                // Fire both axios calls
                return Promise.all([
                    axios.get(yearly_data_url), // Gets the years worth of data 
                    axios.get(current_data_url) // Gets a quote 
                ]).then(resp => {

                    // Get both axios responses
                    const yearlyResp = resp[0];
                    const currentResp = resp[1];

                    if (yearlyResp.status === 200) {
                        let data = yearlyResp.data;
                        let json = parser.IEXParser(data, s);

                        if (currentResp.status === 200) {
                            data = currentResp.data;
                            json["company"] = data.companyName;
                            json["currentPrice"] = data.latestPrice;
                        }

                        results.watchlist.push(json);

                        // Check the length of results.watchlist and watchlist
                        if (watchlist.length === results.watchlist.length) {
                            resolve(true);
                        }
                    }
                }).catch(err => {
                    reject(err);
                })
            });
        }
    });

    try {
        const fetched = await getWatchlist;

        if (fetched) return res.json(results);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * Sends a HEAD request to IEX to see if the stock exists 
 */
exports.checkValidStock = (stock) => {
    let yearly_data_url = IEX_URL;
    yearly_data_url += `/${stock}/chart/1y`;
    yearly_data_url += `?token=${IEX_KEY}`;

    return new Promise((resolve, reject) => {
        axios.head(yearly_data_url).then(result => {
            if (result.status === 200) {
                resolve(true);
            }
        }).catch(err => {
            reject(err);
        })
    })
}