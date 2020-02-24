'use strict';

/**
 * GET /api/stocks/dow30
 * 
 * Gets all stock data of dow 30
 */

const axios = require('axios');

const INTRINIO_KEY = process.env.INTRINIO_KEY;
const INTRINIO_PRICES_URL = process.env.INTRINIO_PRICES_URL;

/**
 * Parses data from intrinio
 */
function intrinioParser(data) {
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

exports.handler = async (event, context) => {
    // Prepare arrays for the dow 30 names
    const dow = ["AAPL", "AXP", "BA", "CAT", "CSCO", "CVX", "DIS", "DWDP", "GE", "GS", "HD", "IBM", "INTC", "JNJ", "JPM", "KO", "MCD", "MMM", "MRK", "MSFT", "NKE", "PFE", "PG", "TRV", "UNH", "UTX", "V", "VZ", "WMT", "XOM"];

    let results = {
        "DOW30": []
    };

    // Iterate through each dow symbol and query intrinio for the data
    const getDow = new Promise((resolve, reject) => {
        for (const symbol of dow) {
            const intrinio_prices_url = `${INTRINIO_PRICES_URL}/${symbol}/prices?api_key=${INTRINIO_KEY}`;

            axios.get(intrinio_prices_url).then(resp => {
                const pricesResp = resp;

                if (pricesResp.status === 200) {
                    let data = pricesResp.data;
                    let json = intrinioParser(data);
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
        }
    });

    // Check if dow data has been fetched
    try {
        const fetched = await getDow;

        if (fetched) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
                },
                body: JSON.stringify(results)
            };
        } else {
            throw new Error("Could not retrieve data for DOW 30!");
        }
    } catch (e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify(e)
        };
    }
}