'use strict';

const db = require("./utils/db");

/** 
 * DELETE /api/user/watchlist
 * 
 * Removes a stock from user_stocks
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { stock, userId } = JSON.parse(event.body);

    try {
        // Connect to db
        await db.connect();

        // Delete user stock
        const affected = await db.deleteUserStock(stock, userId);

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