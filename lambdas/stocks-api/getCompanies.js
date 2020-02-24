'use strict';

/**
 * GET /api/stocks/companies
 * 
 * Returns all the names the database has for companies from database
 */

const { Client } = require("pg");
const postgres = new Client({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

/**
 * Connection to PostgreSQL
 * 
 * Documentation for pg module:
 * https://node-postgres.com/
 * https://github.com/docker-library/postgres/issues/297
 */
async function connect() {
    try {
        await postgres.connect();
    } catch (e) {
        throw new Error(e);
    }
}

// Gets list of companies 
function getCompanies() {
    const query = {
        name: "get-companies",
        text: "select name from stockswatch.companies"
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                if (rows.length > 0) {
                    // The result data will be a list of json objects, parse through each and just return an array of symbols to the client
                    let data = [];
                    rows.forEach(d => {
                        data.push(d.name);
                    });
                    data.sort();

                    resolve(data);
                }
            }

            reject(error);
        });
    })
}

exports.handler = async (event, context) => {
    try {
        // Connect to db
        await connect();

        // Query db
        const data = await getCompanies();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify(data)
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