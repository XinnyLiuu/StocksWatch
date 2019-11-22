'use strict';
const { Client } = require('pg');
/**
 * Connection to PostgreSQL
 * 
 * Documentation for pg module:
 * https://node-postgres.com/
 * https://github.com/docker-library/postgres/issues/297
 */
const postgres = new Client({
    connectionString: process.env.DB_CONNECTION_STRING
});

postgres.connect(err => {
    if (err) console.log(err);
    else console.log("Connected to PostgreSQL!");
});

module.exports = {
    getUserSalt,
    getUserByUsernamePassword,
    getUserStocks,
    insertUser,
    insertUserStock,
    deleteUserStock,
    updateUser,
    getSymbols,
    getCompanies,
    getSymbolByCompany,
    getCompanyBySymbol,
    dropCompanies,
    addCompany
}

// Drop companies
function dropCompanies() {
    let query = {
        name: "drop-companies",
        text: "delete from companies"
    };

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            const affected = results.rowCount;

            if (affected > 0) resolve(affected);
            else reject(error);
        })
    })
}

// Add to company
function addCompany(symbol, name) {
    let query = {
        name: "add-company",
        text: "insert into companies (symbol, name) values ($1, $2) returning *",
        values: [symbol, name]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            const affected = results.rowCount;

            if (affected === 1) resolve(affected);
            else reject(error);
        })
    })
}

// Get the user's salt
function getUserSalt(username) {
    let query = {
        name: "get-user-salt",
        text: "select salt from users where username = $1",
        values: [username]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            results = results.rows;

            // Check length of results
            if (results.length === 1) {
                let salt = results[0].salt;
                resolve(salt);
            }

            reject(error);
        });
    })
}

// Get the user by username and password
function getUserByUsernamePassword(username, password) {
    let query = {
        name: "get-user",
        text: "select user_id, username, firstname, lastname from users where username = $1 and password = $2",
        values: [username, password]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            results = results.rows;

            if (results.length === 1) {
                let userData = results[0];
                userData["stocks"] = [];
                resolve(userData);
            }

            reject(error);
        });
    })
}

// Get the stocks that the user has in their watchlist
function getUserStocks(userId) {
    let query = {
        name: "get-user-stocks",
        text: "select symbol from user_stocks where user_id = $1",
        values: [userId]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            results = results.rows;

            if (results.length >= 0) {
                let stocks = [];
                results.forEach(d => stocks.push(d.symbol));
                resolve(stocks);
            }

            reject(error);
        });
    })
}

// Insert user into database
function insertUser(username, firstname, lastname, password, salt) {
    let query = {
        name: "insert-user",
        text: "insert into users (username, firstname, lastname, password, salt) values ($1, $2, $3, $4, $5) returning *",
        values: [username, firstname, lastname, password, salt]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            // Get affected rows
            const affected = results.rowCount;

            // Get last inserted id
            const insertedId = results.rows[0].user_id;

            // Check affected rows
            if (affected === 1) resolve(insertedId);
            if (affected === 0) reject(error);
        });
    });
}

// Inserts a stock for the user's watchlist
function insertUserStock(stock, userId) {
    let query = {
        name: "insert-stock",
        text: "insert into user_stocks (symbol, user_id) values ($1, $2)",
        values: [stock, userId]
    };

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {

            // Get affected rows
            const affected = results.rowCount;

            // Check affected rows
            if (affected === 1) resolve(1);
            if (affected === 0) reject(error);
        });
    });
}

// Deletes a stock from the user's watchlist
function deleteUserStock(stock, userId) {
    let query = {
        name: "delete-stock",
        text: "delete from user_stocks where symbol = $1 and user_id = $2",
        values: [stock, userId]
    };

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            // Get affected rows
            const affected = results.rowCount;

            // Check affected rows
            if (affected === 1) resolve(1);
            if (affected === 0) reject(error);
        });
    });
}

// Updates an existing user
function updateUser(username, password, firstname, lastname) {
    let query = {
        name: 'update-user',
        text: "update users set username = $1, password = $2, firstname = $3, lastname = $4",
        values: [username, password, firstname, lastname]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            // Get affected rows
            const affected = results.rowCount;

            // Check affected rows
            if (affected === 1) resolve(1);
            if (affected === 0) reject(error);
        });
    });
}

// Gets all list of symbols in database
function getSymbols() {
    const query = {
        name: "get-symbols",
        text: "select symbol from companies"
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            results = results.rows;

            if (results.length === 0) reject(error);
            if (results.length > 0) {
                // The result data will be a list of json objects, parse through each and just return an array of symbols to the client
                let data = [];
                results.forEach(d => {
                    data.push(d.symbol);
                });
                data.sort();

                resolve(data);
            }
        });
    })
}

// Gets list of companies 
function getCompanies() {
    const query = {
        name: "get-companies",
        text: "select name from companies"
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            results = results.rows;

            if (results.length === 0) reject(error);
            if (results.length > 0) {
                // The result data will be a list of json objects, parse through each and just return an array of symbols to the client
                let data = [];
                results.forEach(d => {
                    data.push(d.name);
                });
                data.sort();

                resolve(data);
            }
        });
    })
}

// Get a symbol for a company
function getSymbolByCompany(company) {
    const query = {
        name: "get-symbol-by-company",
        text: "select symbol from companies where name = $1",
        values: [company]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            results = results.rows;

            if (results.length === 0) reject(error);
            if (results.length === 1) {
                const symbol = results[0].symbol;
                resolve(symbol);
            }
        });
    })
}

// Get a company for a symbol
function getCompanyBySymbol(symbol) {
    const query = {
        name: "get-company-for-symbol",
        text: "select name from companies where symbol = $1",
        values: [symbol]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            results = results.rows;

            if (results.length === 0) reject(error);
            if (results.length === 1) {
                const name = results[0].name;
                resolve(name);
            }
        });
    })
}