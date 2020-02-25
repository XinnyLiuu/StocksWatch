'use strict';

const db = require("./utils/db");

/**
 * POST /api/user/watchlist
 * 
 * Adds a stock to user_stocks
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { stock, userId, username } = JSON.parse(event.body);

    try {
        // Connect to db
        await db.connect();

        // Add to user stock
        const affected = await db.insertUserStock(stock, userId, username);

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