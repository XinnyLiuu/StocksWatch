'use strict';
const express = require('express');
const router = express.Router();
const postgres = require("../database/db");
const encryptHelper = require("../utils/encrypt");

/**
 * POST /api/user/login
 * 
 * Recieves a post request from the client containing user login information. Check if the information matches a user in the database - if so, send back user information and log them in
 */
router.post("/login", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        // Query for the user's salt first
        const salt = await postgres.getUserSalt(username);

        // Hash password
        password = encryptHelper.encrypt(password, salt);

        // Check if user exists in db
        const userData = await postgres.getUserByUsernamePassword(username, password);

        const userId = userData.user_id;

        // Find if the user has any symbols in user_stocks
        const stocks = await postgres.getUserStocks(userId);
        stocks.forEach(d => userData.stocks.push(d));

        return res.json(userData);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

/**
 * POST /api/user/register
 * 
 * Takes data from request body and creates an user
 */
router.post("/register", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;

    // Generate a salt
    let salt = encryptHelper.getSalt();

    // Hash the password
    password = encryptHelper.encrypt(password, salt);

    try {
        // Add user
        const insertedId = await postgres.insertUser(username.toLowerCase(), firstname, lastname, password, salt);
        return res.json({
            "id": insertedId
        });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

/**
 * POST /api/user/watchlist
 * 
 * Adds a stock to user_stocks
 */
router.post("/watchlist", async (req, res) => {
    let stock = req.body.stock;
    let userId = req.body.userId;
    let username = req.body.username;

    try {
        // Add to user stock
        const affected = await postgres.insertUserStock(stock, userId, username);
        if (affected === 1) return res.json({
            "symbol": stock
        });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

/** 
 * DELETE /api/user/watchlist
 * 
 * Removes a stock from user_stocks
 */
router.delete("/watchlist", async (req, res) => {
    let stock = req.body.stock;
    let userId = req.body.userId;

    try {
        // Delete user stock
        const affected = await postgres.deleteUserStock(stock, userId);
        if (affected !== null) return res.json({
            "symbol": stock
        });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

/** 
 * PUT /api/user/settings
 * 
 * Receives data from PUT request and updates user information
 */
router.put("/settings", async (req, res) => {
    const userId = req.body.userId;
    let ogUsername = req.body.ogUsername;
    let username = req.body.username;
    let password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    try {
        /**
         * A user's username is a foreign key in the database, as such in order for this update to be successful we need to do a series of actons
         */

        // Get the user's symbols
        const symbols = await postgres.getUserStocksByUsername(ogUsername);

        // Delete all the user's symbols from user_stocks
        if (symbols.length > 0) symbols.forEach(async s =>
            await postgres.deleteUserStockByUsername(s, ogUsername)
        );

        // Because the user is updating their information, to secure users, we should generate a new salt
        let salt = encryptHelper.getSalt();

        // Hash password
        password = encryptHelper.encrypt(password, salt);

        // Update user
        let affected = await postgres.updateUser(ogUsername, username, password, firstname, lastname, salt);
        if (affected === 1) {

            // Add each stock back to the database under the user's new username
            if (symbols.length > 0) symbols.forEach(async s => {
                await postgres.insertUserStock(s, userId, username);
            });

            return res.json({
                username: username,
                firstname: firstname,
                lastname: lastname
            });
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});


module.exports = router;