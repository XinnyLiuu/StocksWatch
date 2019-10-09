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

exports.getStockDataBySymbol = (req, res) => {
    
}