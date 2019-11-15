'use strict';
const { Client } = require('pg');

/**
 * Class representing DB connection
 * 
 * Documentation for pg module:
 * https://node-postgres.com/
 * https://github.com/docker-library/postgres/issues/297
 */
class DB {
    constructor() {
        return new Promise((resolve, reject) => {
            this.connection = new Client({
                connectionString: process.env.DB_CONNECTION_STRING
            });

            this.connection.connect(err => {
                if (err) reject(err);
                else {
                    console.log("Connected to PostgreSQL!");
                    console.log(process.env.DB_CONNECTION_STRING); 
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

    update(query) {
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