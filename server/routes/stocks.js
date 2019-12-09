'use strict';
const express = require('express');
const router = express.Router();
const axios = require('axios');
const parser = require("../utils/parser");
const postgres = require("../database/db");

// API Keys + URLs
const INTRINIO_KEY = process.env.INTRINIO_KEY;
const INTRINIO_PRICES_URL = process.env.INTRINIO_PRICES_URL;

const IEX_KEY = process.env.IEX_KEY;
const IEX_URL = process.env.IEX_URL;

/**
 * GET /api/stocks/yearly/:stock
 * 
 * Gets data for a specified stock
 */
router.get("/yearly/:symbol", async (req, res) => {
    const symbol = req.params.symbol;

    // Build URL
    let yearly_data_url = IEX_URL;
    yearly_data_url += `/${symbol}/chart/2y`;
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
});

/**
 * GET /api/stocks/dow30
 * 
 * Gets all stock data of dow 30
 */
router.get("/dow30", async (req, res) => {
    const dow = ["AAPL", "AXP", "BA", "CAT", "CSCO", "CVX", "DIS", "DWDP", "GE", "GS", "HD", "IBM", "INTC", "JNJ", "JPM", "KO", "MCD", "MMM", "MRK", "MSFT", "NKE", "PFE", "PG", "TRV", "UNH", "UTX", "V", "VZ", "WMT", "XOM"];
    let results = {
        "DOW30": []
    };

    // Iterate through each dow symbol and query intrinio for the data
    let getDow = new Promise((resolve, reject) => {
        dow.forEach(symbol => {
            const intrinio_prices_url = `${INTRINIO_PRICES_URL}/${symbol}/prices?api_key=${INTRINIO_KEY}`;

            axios.get(intrinio_prices_url).then(resp => {
                const pricesResp = resp;

                if (pricesResp.status === 200) {
                    let data = pricesResp.data;
                    let json = parser.intrinioParser(data);
                    json["currentPrice"] = data.stock_prices[0].high;

                    results.DOW30.push(json);

                    // Check the lengths
                    if (dow.length === results.DOW30.length) {
                        resolve(true);
                    }
                }
            }).catch(err => {
                reject(err);
            })
        });
    });

    // Check if dow data has been fetched
    try {
        const fetched = await getDow;
        if (fetched) return res.json(results);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

/**
 * POST /api/stocks/watchlist
 * 
 * Receives a list of the user's watchlists from client and queries them through intrinio, aggregate the data and return it to the client
 */
router.post("/watchlist", async (req, res) => {
    let watchlist = JSON.parse(req.body.watchlist);

    let results = {
        "watchlist": []
    };

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
});

/**
 * GET /api/stocks/symbols
 * 
 * Returns all the symbols the database has for companies from database
 */
router.get("/symbols", async (req, res) => {
    try {
        // Get symbols
        const symbols = await postgres.getSymbols();
        return res.json(symbols);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

/**
 * GET /api/stocks/companies
 * 
 * Returns all the names the database has for companies from database
 */
router.get("/companies", async (req, res) => {
    try {
        // Get companies
        const companies = await postgres.getCompanies();
        return res.json(companies);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

/**
 * GET /api/stocks/convert/company/:company
 *
 * Returns the symbol of a stock for the company
 */
router.get("/convert/company/:company", async (req, res) => {
    const company = req.params.company;

    try {
        // Get symbol
        const symbol = await postgres.getSymbolByCompany(company);
        return res.json(symbol)
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});


/**
 * GET /api/stocks/convert/symbol/:symbol
 *
 * Returns the name of a company for the symbol
 */
router.get("/convert/symbol/:symbol", async (req, res) => {
    const symbol = req.params.symbol;

    try {
        // Get company
        const company = await postgres.getCompanyBySymbol(symbol);
        return res.json(company)
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

module.exports = router;