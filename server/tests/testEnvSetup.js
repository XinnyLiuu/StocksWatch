'use strict';
const exec = require("child_process").exec;
require("custom-env").env(true);

/**
 * Used to setup environment variables for Jest 
 * 
 * 
 * Make sure that test.sql is dumped into the test database 
 * 'psql test_stockswatch < test.sql' 
 */


// Test sql file path
const testSQLPath = "../test.sql";

// Resets the test database
function dumpTestSQL() {
    console.log("Setting up test database...");

    exec(`psql test_stockswatch < ${testSQLPath}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
    })
}

dumpTestSQL();