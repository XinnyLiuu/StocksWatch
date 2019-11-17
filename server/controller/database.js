'use strict';
const DB = require('../database/DB');
const encryptHelper = require("../utils/encrypt");

// API
const stockService = require("../service/stock");

// Instantiate a global DB reference
const postgres = new DB();

/**
 * POST /api/login
 * 
 * Recieves a post request from the client containing user login information. Check if the information matches a user in the database - if so, send back user information and log them in
 */
exports.postUserLogin = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // Query for the user's salt first
    let query = {
        name: "get-user-salt",
        text: "select salt from users where username = $1",
        values: [username]
    }

    try {
        const db = await postgres;
        let results = await db.select(query);

        // Check length of results
        if (results.length === 0) return res.sendStatus(500);
        if (results.length === 1) {
            let salt = results[0].salt;

            // Hash password
            password = encryptHelper.encrypt(password, salt);

            // Check if user exists in db
            query = {
                name: "validate-user",
                text: "select user_id, username, firstname, lastname from users where username = $1 and password = $2",
                values: [username, password]
            }

            results = await db.select(query);

            // Check results
            if (results.length === 0) return res.sendStatus(500);
            if (results.length === 1) {

                // Get user data
                let userData = results[0];
                userData["stocks"] = [];

                const userId = userData.user_id;

                // Find if the user has any symbols in user_stocks
                query = {
                    name: "user-symbols",
                    text: "select symbol from user_stocks where user_id = $1",
                    values: [userId]
                };

                results = await db.select(query);
                results.forEach(d => {
                    userData.stocks.push(d.symbol);
                });

                // Return user data
                return res.json(userData);
            }

            return res.sendStatus(500);
        }

        return res.sendStatus(500);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * POST /api/register
 * 
 * Takes data from request body and creates an user
 */
exports.postUserRegister = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;

    // Generate a salt
    let salt = encryptHelper.getSalt();

    // Hash the password
    password = encryptHelper.encrypt(password, salt);

    // Create query to add the user to the db
    const query = {
        name: "add-user",
        text: "insert into users (username, firstname, lastname, password, salt) values ($1, $2, $3, $4, $5) returning *",
        values: [username, firstname, lastname, password, salt]
    }

    try {
        // Query db
        const db = await postgres;
        const results = await db.insert(query);

        // Get affected rows
        const affected = results.rowCount;

        // Get last inserted id
        const insertedId = results.rows[0].user_id;

        // Check affected rows
        if (affected === 1) return res.json({ "id": insertedId });

        return res.sendStatus(500);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * POST /api/watchlist/add
 * 
 * Adds a stock to user_stocks
 */
exports.postAddStockWatchList = async (req, res) => {
    let stock = req.body.stock;
    let userId = req.body.userId;

    let query = {
        name: "add-stock",
        text: "insert into user_stocks (symbol, user_id) values ($1, $2)",
        values: [stock, userId]
    };

    try {
        // Check if the stock actually exists
        const exists = await stockService.checkValidStock(stock);

        if (exists) {
            const db = await postgres;
            const results = await db.insert(query);

            // Check rows affected
            if (results.rowCount === 1) return res.json({ "symbol": stock });
        }

        return res.sendStatus(500);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/** 
 * DELETE /api/watchlist/remove
 * 
 * Removes a stock from user_stocks
 */
exports.deleteRemoveStockWatchList = async (req, res) => {
    let stock = req.body.stock;
    let userId = req.body.userId;

    let query = {
        name: "delete-stock",
        text: "delete from user_stocks where symbol = $1 and user_id = $2",
        values: [stock, userId]
    }

    try {
        const db = await postgres;
        const results = await db.delete(query);

        if (results.rowCount === 1) return res.json({ "symbol": stock });

        return res.sendStatus(500);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * PUT /api/user
 * 
 * Receives data from PUT request and updates user information
 */
exports.putUserSettings = async (req, res) => {
    const ogUsername = req.body.ogUsername;
    const username = req.body.username;
    let password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    // Get user's salt
    let query = {
        name: "get-user-salt",
        text: "select salt from users where username = $1",
        values: [ogUsername]
    }

    try {
        const db = await postgres;
        let results = await db.select(query);

        // Check length
        if (results.length === 0) return res.sendStatus(500);
        if (results.length === 1) {
            const salt = results[0].salt;

            // Hash password
            password = encryptHelper.encrypt(password, salt);

            // Update user
            query = {
                name: 'update-user',
                text: "update users set username = $1, password = $2, firstname = $3, lastname = $4",
                values: [username, password, firstname, lastname]
            }

            results = await db.update(query);

            // Get affected rows
            const affected = results.rowCount;

            if (affected === 1) {
                return res.json({
                    username: username,
                    firstname: firstname,
                    lastname: lastname
                })
            }

            return res.sendStatus(500);
        }

        return res.sendStatus(500);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * GET /api/symbols
 * 
 * Returns all the symbols the database has for companies from database
 */
exports.getSymbols = async (req, res) => {
    const query = {
        name: "get-symbols",
        text: "select symbol from companies"
    }

    try {
        const db = await postgres;
        const results = await db.select(query);

        if (results.length === 0) return res.sendStatus(500);
        if (results.length > 0) {
            // The result data will be a list of json objects, parse through each and just return an array of symbols to the client
            let data = [];
            results.forEach(d => {
                data.push(d.symbol);
            });
            data.sort();

            return res.json(data);
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * GET /api/companies
 * 
 * Returns all the names the database has for companies from database
 */
exports.getCompanies = async (req, res) => {
    const query = {
        name: "get-companies",
        text: "select name from companies"
    }

    try {
        const db = await postgres;
        const results = await db.select(query);

        if (results.length === 0) return res.sendStatus(500);
        if (results.length > 0) {
            // The result data will be a list of json objects, parse through each and just return an array of symbols to the client
            let data = [];
            results.forEach(d => {
                data.push(d.name);
            });
            data.sort();

            return res.json(data);
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * GET /api/convert/company/:company
 *
 * Returns the symbol of a stock for the company
 */
exports.getSymbolByCompany = async (req, res) => {
    const company = req.params.company;

    const query = {
        name: "get-symbol-for-company",
        text: "select symbol from companies where name = $1",
        values: [company]
    }

    try {
        const db = await postgres;
        const results = await db.select(query);

        if (results.length === 0) return res.sendStatus(500);
        if (results.length === 1) {
            const symbol = results[0].symbol;
            return res.json(symbol);
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

/**
 * GET /api/convert/symbol/:symbol
 *
 * Returns the name of a company for the symbol
 */
exports.getCompanyBySymbol = async (req, res) => {
    const symbol = req.params.symbol;

    const query = {
        name: "get-company-for-symbol",
        text: "select name from companies where symbol = $1",
        values: [symbol]
    }

    try {
        const db = await postgres;
        const results = await db.select(query);

        if (results.length === 0) return res.sendStatus(500);
        if (results.length === 1) {
            const name = results[0].name;
            return res.json(name);
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}