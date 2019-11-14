'use strict';
const DB = require('../database/DB');
const encryptHelper = require("../utils/encrypt");

// API
const apiService = require("../service/api");

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
        const exists = await apiService.checkValidStock(stock);

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