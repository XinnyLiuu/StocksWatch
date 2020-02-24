'use strict';

const db = require("./utils/db");

/**
 * GET /api/stocks/companies
 * 
 * Returns all the names the database has for companies from database
 */
exports.handler = async (event, context) => {
    try {
        // Connect to db
        await db.connect();

        // Query db
        const data = await db.getCompanies();

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