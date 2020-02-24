'use strict';

const db = require("./utils/db");

/**
 * GET /api/stocks/convert/company/:company
 *
 * Returns the symbol of a stock for the company
 */
exports.handler = async (event, context) => {
    // Get company name from request param
    const { company } = event.pathParameters;

    try {
        // Connect to db
        await db.connect();

        // Query db
        const symbol = await db.getSymbolByCompany(company);

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