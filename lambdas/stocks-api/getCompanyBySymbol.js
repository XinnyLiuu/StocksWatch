'use strict';

const db = require("./utils/db");

/**
 * GET /api/stocks/convert/symbol/:symbol
 *
 * Returns the name of a company for the symbol
 */
exports.handler = async (event, context) => {
    // Get symbol name from request param
    const { symbol } = event.pathParameters;

    try {
        // Connect to db
        await db.connect();

        // Query db
        const company = await db.getCompanyBySymbol(symbol);

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