'use strict';

/**
 * GET /api/stocks/convert/company/:company
 *
 * Returns the symbol of a stock for the company
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

// Get a symbol for a company
function getSymbolByCompany(company) {
    const query = {
        name: "get-symbol-by-company",
        text: "select symbol from stockswatch.companies where name = $1",
        values: [company]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                if (rows.length === 1) {
                    const symbol = rows[0].symbol;
                    resolve(symbol);
                }
            }

            reject(error);
        });
    })
}

exports.handler = async (event, context) => {
    // Get company name from request param
    const { company } = event.pathParameters;

    try {
        // Connect to db
        await connect();

        // Query db
        const symbol = await getSymbolByCompany(company);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify(symbol)
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