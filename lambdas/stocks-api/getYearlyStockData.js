'use strict';

const axios = require('axios');

const parser = require("./utils/parser");

const IEX_KEY = process.env.IEX_KEY;
const IEX_URL = process.env.IEX_URL;

/**
 * GET /api/stocks/yearly/:stock
 * 
 * Gets data for a specified stock
 */
exports.handler = async (event, context) => {
	// Get the stock from the path
	const { stock } = event.pathParameters;
	const symbol = stock;

	// Build URL
	let yearly_data_url = IEX_URL;
	yearly_data_url += `/${symbol}/chart/2y`;
	yearly_data_url += `?token=${IEX_KEY}`;

	try {
		// Get the data for the stock
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

			return {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*', // Required for CORS support to work
					'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
				},
				body: JSON.stringify(json)
			};
		} else {
			throw new Error("Could not get stock data!");
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