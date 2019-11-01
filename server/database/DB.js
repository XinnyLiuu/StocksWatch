/**
 * Class representing DB connection
 */
'use strict';

const mysql = require('mysql');

class DB {
    constructor() {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            });

            this.connection.connect(err => {
                if (err) reject(err);
                else {
                    console.log("Connected to MySQL!");
                    resolve(this);
                }
            });
        });
    }

    select(sql, params) {
        return new Promise((resolve, reject) => {
            sql = mysql.format(sql, params);

            this.connection.query(sql, (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        })
    }

    insert(sql, params) {
        return new Promise((resolve, reject) => {
            sql = mysql.format(sql, params);

            this.connection.query(sql, (error, results, fields) => {
                if (error) reject(error);
                else resolve(results.affectedRows);
            });
        })
    }

    delete(sql, params) {
        return new Promise((resolve, reject) => {
            sql = mysql.format(sql, params);

            this.connection.query(sql, (error, results, fields) => {
                if (error) reject(error);
                else resolve(results.affectedRows);
            });
        })
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end();
            resolve("Connection to MySQL closed!");
        });
    }
}

// Connect to MySQL
module.exports = DB;