'use strict';
const DB = require('../database/DB.js');
const DatabaseException = require("../exceptions/DatabaseException");

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

    const query = `select user_id, username, firstname, lastname from users where username = ? and password = sha2(?, 256)`;
    const params = [username, password];

    // Query DB to check if user exists
    mysql.then(db => {
        db.select(query, params).then(resp => {
            // Check length
            if (resp.length === 0) {
                console.log("No user found!");
            }

            if (resp.length === 1) {
                let userData = resp[0];

                // Return user data
                return res.set({
                    "Content-Type": "application/json"
                }).send(userData);
            }
        }).catch(err => {
            try {
                throw new DatabaseException("Error in query", err);
            } catch (e) {
                console.log(e);
            }
        })
    }).catch(err => {
        try {
            throw new DatabaseException("Error in query", err);
        } catch (e) {
            console.log(e);
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
                return res.set({
                    "Content-Type": "application/json"
                }).send({
                    "id": lastInsertId
                });
            }
        }).catch(err => {
            try {
                throw new DatabaseException("Error in query", err);
            } catch (e) {
                console.log(e);
            }
        })
    }).catch(err => {
        try {
            throw new DatabaseException("Error in query", err);
        } catch (e) {
            console.log(e);
        }
    })
}