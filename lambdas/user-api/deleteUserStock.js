'use strict';
const { Client } = require("pg");

/** 
 * DELETE /api/user/watchlist
 * 
 * Removes a stock from user_stocks
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { stock, userId } = JSON.parse(event.body);

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

        // Delete user stock
        let query = {
            name: "delete-stock",
            text: "delete from stockswatch.user_stocks where symbol = $1 and user_id = $2",
            values: [stock, userId]
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