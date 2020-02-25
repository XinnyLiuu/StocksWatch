'use strict';

const db = require("./utils/db");
const encryptHelper = require("./utils/encrypt");

/**
 * POST /api/user/login
 * 
 * Recieves a post request from the client containing user login information. Check if the information matches a user in the database - if so, send back user information and log them in
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { username, password } = JSON.parse(event.body);

    try {
        // Connect to db
        await db.connect();
        
        // Query for the user's salt first
        const salt = await db.getUserSalt(username);

        // Hash password
        password = encryptHelper.encrypt(password, salt);

        // Check if user exists in db
        const userData = await db.getUserByUsernamePassword(username, password);

        const userId = userData.user_id;

        // Find if the user has any symbols in user_stocks
        const stocks = await db.getUserStocks(userId);
        stocks.forEach(d => userData.stocks.push(d));

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify(userData)
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