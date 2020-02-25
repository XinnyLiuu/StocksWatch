// Postgres Client object
const { Client } = require("pg");
const postgres = new Client({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports = {
    connect,
    getUserSalt,
    getUserByUsernamePassword,
    getUserStocks,
    getUserStocksByUsername,
    insertUser,
    insertUserStock,
    deleteUserStock,
    deleteUserStockByUsername,
    updateUser,
    getSymbols,
    getCompanies,
    getSymbolByCompany,
    getCompanyBySymbol,
    dropCompanies,
    addCompany
}

/**
 * Connection to PostgreSQL
 * 
 * Documentation for pg module:
 * https://node-postgres.com/
 * https://github.com/docker-library/postgres/issues/297
 */
async function connect() {
    try {
        await postgres.connect();
    } catch (e) {
        throw new Error(e);
    }
}

// Drop companies
function dropCompanies() {
    let query = {
        name: "drop-companies",
        text: "delete from stockswatch.companies"
    };

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const affected = results.rowCount;

                if (affected >= 0) resolve(affected);
            }

            reject(error);
        })
    })
}

// Add to company
function addCompany(symbol, name) {
    let query = {
        name: "add-company",
        text: "insert into stockswatch.companies (symbol, name) values ($1, $2) returning *",
        values: [symbol, name]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const affected = results.rowCount;

                if (affected === 1) resolve(affected);
            }

            reject(error);
        })
    })
}

// Get the user's salt
function getUserSalt(username) {
    let query = {
        name: "get-user-salt",
        text: "select salt from stockswatch.users where username = $1",
        values: [username]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                // Check length of rows
                if (rows.length === 1) {
                    let salt = rows[0].salt;
                    resolve(salt);
                } else {
                    resolve(0);
                }
            }

            reject(error);
        });
    })
}

// Get the user by username and password
function getUserByUsernamePassword(username, password) {
    let query = {
        name: "get-user",
        text: "select user_id, username, firstname, lastname from stockswatch.users where username = $1 and password = $2",
        values: [username, password]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                // Check length of rows
                if (rows.length === 1) {
                    let userData = rows[0];
                    userData["stocks"] = [];
                    resolve(userData);
                }
            }

            reject(error);
        });
    })
}

// Get the stocks that the user has in their watchlist
function getUserStocks(userId) {
    let query = {
        name: "get-user-stocks",
        text: "select symbol from stockswatch.user_stocks where user_id = $1",
        values: [userId]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                if (rows.length >= 0) {
                    let stocks = [];
                    rows.forEach(d => stocks.push(d.symbol));
                    resolve(stocks);
                }
            }

            reject(error);
        });
    })
}

// Get the stocks that the user has in their watchlist based on their username
function getUserStocksByUsername(username) {
    let query = {
        name: "get-user-stocks-by-username",
        text: "select symbol from stockswatch.user_stocks where username = $1",
        values: [username]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                if (rows.length >= 0) {
                    let stocks = [];
                    rows.forEach(d => stocks.push(d.symbol));
                    resolve(stocks);
                }
            }

            reject(error);
        });
    })
}

// Insert user into database
function insertUser(username, firstname, lastname, password, salt) {
    let query = {
        name: "insert-user",
        text: "insert into stockswatch.users (username, firstname, lastname, password, salt) values ($1, $2, $3, $4, $5) returning *",
        values: [username, firstname, lastname, password, salt]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const affected = results.rowCount;

                // Get last inserted id
                const insertedId = results.rows[0].user_id;

                // Check affected rows
                if (affected === 1) resolve(insertedId);
            }

            reject(error);
        });
    });
}

// Inserts a stock for the user's watchlist
function insertUserStock(stock, userId, username) {
    let query = {
        name: "insert-stock",
        text: "insert into stockswatch.user_stocks (symbol, user_id, username) values ($1, $2, $3)",
        values: [stock, userId, username]
    };

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                // Get affected rows
                const affected = results.rowCount;

                // Check affected rows
                if (affected === 1) resolve(1);
            }

            reject(error);
        });
    });
}

// Deletes a stock from the user's watchlist
function deleteUserStock(stock, userId) {
    let query = {
        name: "delete-stock",
        text: "delete from stockswatch.user_stocks where symbol = $1 and user_id = $2",
        values: [stock, userId]
    };

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                // Get affected rows
                const affected = results.rowCount;

                // Check affected rows
                if (affected === 1) resolve(1);
            }

            reject(error);
        });
    });
}

// Deletes a stock from the user's watchlist based on the username
function deleteUserStockByUsername(stock, username) {
    let query = {
        name: "delete-stock-by-username",
        text: "delete from stockswatch.user_stocks where symbol = $1 and username = $2",
        values: [stock, username]
    };

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                // Get affected rows
                const affected = results.rowCount;

                // Check affected rows
                if (affected === 1) resolve(1);
            }

            reject(error);
        });
    });
}

// Updates an existing user
function updateUser(ogUsername, username, password, firstname, lastname, salt) {
    let query = {
        name: 'update-user',
        text: "update stockswatch.users set username = $2, password = $3, firstname = $4, lastname = $5, salt = $6 where username = $1",
        values: [ogUsername, username, password, firstname, lastname, salt]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                // Get affected rows
                const affected = results.rowCount;

                // Check affected rows
                if (affected === 1) resolve(1);
            }

            reject(error);
        });
    });
}

// Gets all list of symbols in database
function getSymbols() {
    const query = {
        name: "get-symbols",
        text: "select symbol from stockswatch.companies"
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                if (rows.length > 0) {
                    // The result data will be a list of json objects, parse through each and just return an array of symbols to the client
                    let data = [];
                    rows.forEach(d => {
                        data.push(d.symbol);
                    });
                    data.sort();

                    resolve(data);
                }
            }

            reject(error);
        });
    })
}

// Gets list of companies 
function getCompanies() {
    const query = {
        name: "get-companies",
        text: "select name from stockswatch.companies"
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                if (rows.length > 0) {
                    // The result data will be a list of json objects, parse through each and just return an array of symbols to the client
                    let data = [];
                    rows.forEach(d => {
                        data.push(d.name);
                    });
                    data.sort();

                    resolve(data);
                }
            }

            reject(error);
        });
    })
}

// Get a symbol for a company
function getSymbolByCompany(company) {
    const query = {
        name: "get-symbol-by-company",
        text: "select symbol from stockswatch.companies where name = $1",
        values: [company]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                if (rows.length === 1) {
                    const symbol = rows[0].symbol;
                    resolve(symbol);
                }
            }

            reject(error);
        });
    })
}

// Get a company for a symbol
function getCompanyBySymbol(symbol) {
    const query = {
        name: "get-company-for-symbol",
        text: "select name from stockswatch.companies where symbol = $1",
        values: [symbol]
    }

    return new Promise((resolve, reject) => {
        postgres.query(query, (error, results) => {
            if (typeof results !== 'undefined') {
                const rows = results.rows;

                if (rows.length === 1) {
                    const symbol = rows[0].name;
                    resolve(symbol);
                }
            }

            reject(error);
        });
    })
}