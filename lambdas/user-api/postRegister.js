'use strict';

const { Client } = require("pg");
const encryptHelper = require("./utils/encrypt");

/**
 * POST /api/user/register
 * 
 * Takes data from request body and creates an user
 */
exports.handler = async (event, context) => {
    // Get the user info from request body
    let { username, password, firstname, lastname } = JSON.parse(event.body);

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

        // First, check if the username is already taken. Setting a composite primary key with Postgres does not enforce uniqueness of the two keys. We can check if the username is already taken by getting the salt for the username. If the salt is returned, then the username is taken.
        let query = {
            name: "get-user-salt",
            text: "select salt from stockswatch.users where username = $1",
            values: [username]
        }

        let rows = await (await postgres.query(query)).rows;
        let salt = rows.length === 1 ? rows[0].salt : 0;

        if (salt !== 0) throw new Error("Operation failed!");

        // Generate a salt
        salt = encryptHelper.getSalt();

        // Hash the password
        password = encryptHelper.encrypt(password, salt);

        // Add user
        query = {
            name: "insert-user",
            text: "insert into stockswatch.users (username, firstname, lastname, password, salt) values ($1, $2, $3, $4, $5) returning *",
            values: [username.toLowerCase(), firstname, lastname, password, salt]
        }

        const insertedId = await (await postgres.query(query)).rows[0].user_id;

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