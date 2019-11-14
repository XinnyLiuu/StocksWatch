'use strict';
const { Client } = require('pg');

/**
 * Class representing DB connection
 * 
 * Documentation for pg module:
 * https://node-postgres.com/
 */
class DB {
    constructor() {
        return new Promise((resolve, reject) => {
            this.connection = new Client({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            });

            this.connection.connect(err => {
                if (err) reject(err);
                else {
                    console.log("Connected to PostgreSQL!");
                    resolve(this);
                }
            });
        });
    }

    select(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results.rows);
            });
        })
    }

    insert(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        })
    }

    delete(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        })
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end();
            resolve("Connection to PostgreSQL closed!");
        });
    }
}

module.exports = DB;