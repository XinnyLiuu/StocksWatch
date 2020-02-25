'use strict';
const { Client } = require("pg");

/**
 * GET /api/stocks/symbols
 * 
 * Returns all the symbols the database has for companies from database
 */
exports.handler = async (event, context) => {
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
            name: "get-symbols",
            text: "select symbol from stockswatch.companies"
        }

        const rows = await (await postgres.query(query)).rows;

        // The result data will be a list of json objects, parse through each and just return an array of symbols to the client
        let data = [];
        rows.forEach(d => {
            data.push(d.symbol);
        });
        data.sort();

        // Close connection 
        await postgres.end();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify(data)
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