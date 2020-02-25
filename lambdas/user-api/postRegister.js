'use strict';

const db = require("./utils/db");
const encryptHelper = require("./utils/encrypt");

/**
 * POST /api/user/register
 * 
 * Takes data from request body and creates an user
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { username, password, firstname, lastname } = JSON.parse(event.body);

    try {
        // Connect to db
        await db.connect();
        
        // First, check if the username is already taken. Setting a composite primary key with Postgres does not enforce uniqueness of the two keys. We can check if the username is already taken by getting the salt for the username. If the salt is returned, then the username is taken.
        let salt = await db.getUserSalt(username);
        if (salt !== 0) throw new Error("Operation failed!");

        // Generate a salt
        salt = encryptHelper.getSalt();

        // Hash the password
        password = encryptHelper.encrypt(password, salt);

        // Add user
        const insertedId = await db.insertUser(username.toLowerCase(), firstname, lastname, password, salt);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify(insertedId)
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