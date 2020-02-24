'use strict';

/**
 * POST /api/stocks/watchlist
 * 
 * Receives a list of the user's watchlists from client and queries them through intrinio, aggregate the data and return it to the client
 */

const axios = require('axios');

const IEX_KEY = process.env.IEX_KEY;
const IEX_URL = process.env.IEX_URL;

/**
 * Parses data from IEX
 */
function IEXParser(data, s) {
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

exports.handler = async (event, context) => {
    // Get the watchlist from request body
    let { watchlist } = JSON.parse(event.body);

    let results = {
        "watchlist": []
    };

    // Iterate through every symbol in the user's watchlist
    const getWatchlist = new Promise((resolve, reject) => {
        if (watchlist.length > 0) {
            for (const s of watchlist) {

                // Build URLs
                let yearly_data_url = IEX_URL;
                yearly_data_url += `/${s}/chart/2y`;
                yearly_data_url += `?token=${IEX_KEY}`;

                // Note: Getting a quote from iex in an iteration seems to trigger a 429 as of Jan 2020. Check git history for implementation.

                // Note: It seems like querying more than 3 symbols is not allowed for the api as of Fed 2020.

                // Get data from IEX endpoint
                axios.get(yearly_data_url)
                    .then(resp => {

                        // Get both axios responses
                        const yearlyResp = resp;

                        if (yearlyResp.status === 200) {
                            let data = yearlyResp.data;
                            let json = IEXParser(data, s);
                            json["currentPrice"] = data[data.length - 1].close;

                            results.watchlist.push(json);

                            // Check the length of results.watchlist and watchlist
                            if (watchlist.length === results.watchlist.length) {
                                resolve(true);
                            }
                        }
                    }).catch(err => {
                        reject(err);
                    })
            }
        }
    });

    // Check if dow data has been fetched
    try {
        const fetched = await getWatchlist;

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
            throw new Error("Could not get watchlist data!");
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