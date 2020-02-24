'use strict';

/**
 * GET /api/stocks/convert/symbol/:symbol
 *
 * Returns the name of a company for the symbol
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

// Get a company for a symbol
function getCompanyBySymbol(symbol) {
    const query = {
        name: "get-company-for-symbol",
        text: "select name from stockswatch.companies where symbol = $1",
        values: [symbol]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                if (rows.length === 1) {
                    const company = rows[0].name;
                    resolve(company);
                }
            }

            reject(error);
        });
    })
}

exports.handler = async (event, context) => {
    // Get symbol name from request param
    const { symbol } = event.pathParameters;

    try {
        // Connect to db
        await connect();

        // Query db
        const company = await getCompanyBySymbol(symbol);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS			
            },
            body: JSON.stringify(company)
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