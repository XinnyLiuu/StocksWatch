'use strict';

/**
 * GET /api/stocks/yearly/:stock
 * 
 * Gets data for a specified stock
 */

// const { Client } = require("pg");
const axios = require('axios');

const IEX_KEY = process.env.IEX_KEY;
const IEX_URL = process.env.IEX_URL;

// /**
//  * Connection to PostgreSQL
//  * 
//  * Documentation for pg module:
//  * https://node-postgres.com/
//  * https://github.com/docker-library/postgres/issues/297
//  */
// async function connect() {
// 	const postgres = new Client({
// 		host: process.env.HOST,
// 		port: process.env.PORT,
// 		user: process.env.USER,
// 		password: process.env.PASSWORD
// 	});

// 	try {
// 		await postgres.connect();
// 	} catch (e) {
// 		throw new Error(e);
// 	}
// }

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
			const json = IEXParser(data, symbol);

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