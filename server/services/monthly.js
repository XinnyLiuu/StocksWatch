/**
 * Routes related to monthly data will be handled here
 */
'use strict';
const axios = require('axios');

/**
 * The following is the url to Alpha Vantage's api
 * 
 * Each url requires query params for `symbol`, `apikey`
 */
let monthly_data_url = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY";

const API_KEY = "LJEUMU08WEO5H2NE";

/**
 * Gets stock data from API using symbol
 */
exports.getStockDataBySymbol = (req, res) => {
    const symbol = req.params.symbol;

    // Prepare url
    monthly_data_url += `&symbol=${symbol}`;
    monthly_data_url += `&apikey=${API_KEY}`;

    axios.get(monthly_data_url)
        .then(result  => {
            // Check response status
            if (result.status === 200) {
                const data = result.data;
                const json = parseData(data);       

                res.setHeader("Content-Type", 'application/json'); 
                res.send( JSON.stringify(json) );
            } else {
                // Send error status code
                res.statusCode = 500; 
                res.send( "Error in Server!" );
            }
        })
        .catch(err => {
            console.log(err);
        });

    // Parse the data and filter out data that we do not want
    function parseData(data) { 
        const metadata = data["Meta Data"];
        const symbol = metadata["2. Symbol"];
        const timezone = metadata["4. Time Zone"];

        const monthlydata = data["Monthly Time Series"];

        // JSON to be returned
        let json = {
            "symbol": symbol,
            "timezone": timezone,
            "prices": {
                "high": [], // Contains array of [date, high]
                "low": [] // Contains array of [date, low]
            }
        }; 

        // Iterate through every monthly data 
        for(let key in monthlydata) {
            const date = key;
            const monthData = monthlydata[date];

            // Get the highs
            const high = monthData["2. high"];
            let highArr = [];
            highArr.push( date );
            highArr.push( high );
            json["prices"]["high"].push( highArr );

            // Get the lows
            const low = monthData["3. low"];
            let lowArr = [];
            lowArr.push( date );
            lowArr.push( low );
            json["prices"]["low"].push( lowArr );
        }

        return json;
    }
}