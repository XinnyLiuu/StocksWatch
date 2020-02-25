'use strict';

const { Client } = require("pg");
const encryptHelper = require("./utils/encrypt");

/**
 * POST /api/user/login
 * 
 * Recieves a post request from the client containing user login information. Check if the information matches a user in the database - if so, send back user information and log them in
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { username, password } = JSON.parse(event.body);

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

        // Query for the user's salt first
        let query = {
            name: "get-user-salt",
            text: "select salt from stockswatch.users where username = $1",
            values: [username]
        }

        const salt = await (await postgres.query(query)).rows[0].salt;

        // Hash password
        password = encryptHelper.encrypt(password, salt);

        // Check if user exists in db
        query = {
            name: "get-user",
            text: "select user_id, username, firstname, lastname from stockswatch.users where username = $1 and password = $2",
            values: [username, password]
        }

        const userData = await (await postgres.query(query)).rows[0];
        userData["stocks"] = [];

        const userId = userData.user_id;

        // Find if the user has any symbols in user_stocks
        query = {
            name: "get-user-stocks",
            text: "select symbol from stockswatch.user_stocks where user_id = $1",
            values: [userId]
        }

        const rows = await (await postgres.query(query)).rows;
        let stocks = [];
        rows.forEach(d => stocks.push(d.symbol));
        stocks.forEach(d => userData.stocks.push(d));

        // Close connection 
        await postgres.end();

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