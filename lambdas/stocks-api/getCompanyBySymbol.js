'use strict';
const { Client } = require("pg");

/**
 * GET /api/stocks/convert/symbol/:symbol
 *
 * Returns the name of a company for the symbol
 */

exports.handler = async (event, context) => {
    // Get symbol name from request param
    const { symbol } = event.pathParameters;

    const postgres = new Client({
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });

    try {
        // Connect to db
        await postgres.connect();

        // Query db
        const query = {
            name: "get-company-for-symbol",
            text: "select name from stockswatch.companies where symbol = $1",
            values: [symbol]
        }

        const rows = await (await postgres.query(query)).rows;

        // Close connection 
        await postgres.end();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify(rows[0].name)
        };
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