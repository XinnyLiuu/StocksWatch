'use strict';
const DB = require('../database/DB.js');
const DatabaseException = require("../exceptions/DatabaseException");

// API
const apiService = require("../service/api");

// Instantiate a global DB reference
const mysql = new DB();

/**
 * POST /api/login
 * 
 * Recieves a post request from the client containing user login information. Check if the information matches a user in the database - if so, send back user information and log them in
 */
exports.postUserLogin = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let query = `select user_id, username, firstname, lastname from users where username = ? and password = sha2(?, 256)`;
    let params = [username, password];

    // Query DB to check if user exists
    mysql.then(db => {
        db.select(query, params).then(resp => {
            // Check length
            if (resp.length === 0) {
                // Return error to the client
                return res.sendStatus(500);
            }

            if (resp.length === 1) {
                let userData = resp[0];
                userData["stocks"] = [];
                const userId = userData.user_id;

                // Find if the user has any symbols in user_stocks
                query = 'select symbol from user_stocks where user_id = ?';
                params = [userId];

                db.select(query, params).then(resp => {
                    resp.forEach(d => {
                        userData.stocks.push(d.symbol);
                    });

                    // Return user data
                    return res.json(userData);
                }).catch(err => {
                    try {
                        throw new DatabaseException("Error in query", err);
                    } catch (e) {
                        console.log(e);
                        return res.sendStatus(500);
                    }
                })
            }
        }).catch(err => {
            try {
                throw new DatabaseException("Error in query", err);
            } catch (e) {
                console.log(e);
                return res.sendStatus(500);
            }
        })
    }).catch(err => {
        try {
            throw new DatabaseException("Error in query", err);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    })
}

/**
 * POST /api/register
 * 
 * Takes data from request body and creates an user
 */
exports.postUserRegister = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;

    const query = `insert into users (username, firstname, lastname, password) values (?, ?, ?, sha2(?, 256))`;
    const params = [username, firstname, lastname, password];

    mysql.then(db => {
        db.insert(query, params).then(resp => {
            let affected = resp.affectedRows;
            let lastInsertId = resp.insertId;

            // Check affected rows
            if (affected === 1) {
                return res.json({ "id": lastInsertId });
            } else {
                return res.sendStatus(500);
            }
        }).catch(err => {
            try {
                throw new DatabaseException("Error in query", err);
            } catch (e) {
                console.log(e);
                return res.sendStatus(500);
            }
        })
    }).catch(err => {
        try {
            throw new DatabaseException("Error in query", err);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    })
}

/**
 * POST /api/watchlist/add
 * 
 * Adds a stock to user_stocks
 */
exports.postAddStockWatchList = (req, res) => {
    let stock = req.body.stock;
    let userId = req.body.userId;

    const query = `insert into user_stocks (symbol, user_id) values (?, ?)`;
    const params = [stock, userId];

    // Check if the stock actually exists
    apiService.checkValidStock(stock).then(() => {
        mysql.then(db => {
            db.insert(query, params).then(resp => {
                // Check affected rows
                if (resp === 1) {
                    return res.json({ "symbol": stock });
                }
            }).catch(err => {
                try {
                    throw new DatabaseException("Error in query", err);
                } catch (e) {
                    console.log(e);
                    return res.sendStatus(500);
                }
            })
        }).catch(err => {
            try {
                throw new DatabaseException("Error in query", err);
            } catch (e) {
                console.log(e);
                return res.sendStatus(500);
            }
        })
    }).catch(err => {
        console.log(err);
        return res.sendStatus(500);
    })
}

/** 
 * DELETE /api/watchlist/remove
 * 
 * Removes a stock from user_stocks
 */
exports.deleteRemoveStockWatchList = (req, res) => {
    let stock = req.body.stock;
    let userId = req.body.userId;

    const query = 'delete from user_stocks where symbol = ? and user_id = ?';
    const params = [stock, userId];

    mysql.then(db => {
        db.delete(query, params).then(resp => {
            // Check affected rows
            if (resp === 1) {
                return res.json({ "symbol": stock });
            } else {
                return res.sendStatus(500);
            }
        }).catch(err => {
            try {
                throw new DatabaseException("Error in query", err);
            } catch (e) {
                console.log(e);
                return res.sendStatus(500);
            }
        })
    }).catch(err => {
        try {
            throw new DatabaseException("Error in query", err);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    })
}