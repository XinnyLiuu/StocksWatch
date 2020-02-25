'use strict';

const { Client } = require("pg");
const encryptHelper = require("./utils/encrypt");

/** 
 * PUT /api/user/settings
 * 
 * Receives data from PUT request and updates user information
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { userId, ogUsername, username, password, firstname, lastname } = JSON.parse(event.body);

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

        /**
         * A user's username is a foreign key in the database, as such in order for this update to be successful we need to do a series of actons
         */

        // Get the user's symbols
        let query = {
            name: "get-user-stocks-by-username",
            text: "select symbol from stockswatch.user_stocks where username = $1",
            values: [ogUsername]
        }

        const rows = await (await postgres.query(query)).rows;

        let symbols = [];
        rows.forEach(d => symbols.push(d.symbol));

        // Delete all the user's symbols from user_stocks
        if (symbols.length > 0) {
            for (const s of symbols) {
                query = {
                    name: "delete-stock-by-username",
                    text: "delete from stockswatch.user_stocks where symbol = $1 and username = $2",
                    values: [s, ogUsername]
                };

                await postgres.query(query);
            }
        }

        // Because the user is updating their information, to secure users, we should generate a new salt
        let salt = encryptHelper.getSalt();

        // Hash password
        password = encryptHelper.encrypt(password, salt);

        // Update user
        query = {
            name: 'update-user',
            text: "update stockswatch.users set username = $2, password = $3, firstname = $4, lastname = $5, salt = $6 where username = $1",
            values: [ogUsername, username, password, firstname, lastname, salt]
        }

        let affected = await (await postgres.query(query)).rowCount;

        if (affected === 1) {
            // Add each stock back to the database under the user's new username
            if (symbols.length > 0) {
                for (const s of symbols) {
                    query = {
                        name: "insert-stock",
                        text: "insert into stockswatch.user_stocks (symbol, user_id, username) values ($1, $2, $3)",
                        values: [s, userId, username]
                    };

                    await postgres.query(query);
                }
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