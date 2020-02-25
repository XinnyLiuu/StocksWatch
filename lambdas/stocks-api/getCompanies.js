'use strict';
const { Client } = require("pg");

/**
 * GET /api/stocks/companies
 * 
 * Returns all the names the database has for companies from database
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
            name: "get-companies",
            text: "select name from stockswatch.companies"
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
            body: JSON.stringify(e)
        };
    }
}