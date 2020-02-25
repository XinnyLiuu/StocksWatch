'use strict';
const { Client } = require("pg");

/**
 * POST /api/user/watchlist
 * 
 * Adds a stock to user_stocks
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { stock, userId, username } = JSON.parse(event.body);

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

        // Add to user stock
        let query = {
            name: "insert-stock",
            text: "insert into stockswatch.user_stocks (symbol, user_id, username) values ($1, $2, $3)",
            values: [stock, userId, username]
        };

        const affected = await (await postgres.query(query)).rowCount;

        // Close connection 
        await postgres.end();

        if (affected === 1) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
                },
                body: JSON.stringify({
                    "symbol": stock
                })
            };
        } else {
            throw new Error("Operation failed!");
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