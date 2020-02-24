'use strict';

/**
 * POST /api/user/login
 * 
 * Recieves a post request from the client containing user login information. Check if the information matches a user in the database - if so, send back user information and log them in
 */

const crypto = require("crypto");
const { Client } = require("pg");

const db = require("./db");
const encryptHelper = require("./encrypt");