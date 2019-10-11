/**
 * Class representing DB connection
 */
'use strict';
const mysql = require('mysql');

class DB {
    constructor() {
        let connection;

        connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        connection.connect(err => {
            if(err) console.log(err);
            console.log("Connected to MySQL!");
        })
    }

    // TODO: All queries to database should exist as methods
}