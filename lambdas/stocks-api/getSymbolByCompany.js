'use strict';
const { Client } = require("pg");

/**
 * GET /api/stocks/convert/company/:company
 *
 * Returns the symbol of a stock for the company
 */
exports.handler = async (event, context) => {
    // Get company name from request param
    let { company } = event.pathParameters;
    company = decodeURI(company);

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
            name: "get-symbol-by-company",
            text: "select symbol from stockswatch.companies where name = $1",
            values: [company]
        }

        const rows = await postgres.query(query);

        // Close connection
        await postgres.end();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify(rows)
        };
    } catch (e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify("Bad Request")
        };
    }
}