'use strict';

const db = require("./utils/db");
const encryptHelper = require("./utils/encrypt");

/** 
 * PUT /api/user/settings
 * 
 * Receives data from PUT request and updates user information
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { userId, ogUsername, username, password, firstname, lastname } = JSON.parse(event.body);

    try {
        // Connect to db
        await db.connect();

        /**
         * A user's username is a foreign key in the database, as such in order for this update to be successful we need to do a series of actons
         */

        // Get the user's symbols
        const symbols = await db.getUserStocksByUsername(ogUsername);

        // Delete all the user's symbols from user_stocks
        if (symbols.length > 0) {
            for (const s of symbols) await db.deleteUserStockByUsername(s, ogUsername)
        }

        // Because the user is updating their information, to secure users, we should generate a new salt
        let salt = encryptHelper.getSalt();

        // Hash password
        password = encryptHelper.encrypt(password, salt);

        // Update user
        let affected = await db.updateUser(ogUsername, username, password, firstname, lastname, salt);

        if (affected === 1) {
            // Add each stock back to the database under the user's new username
            if (symbols.length > 0) {
                for (const s of symbols) await db.insertUserStock(s, userId, username);
            }

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
                },
                body: JSON.stringify({
                    username: username,
                    firstname: firstname,
                    lastname: lastname
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