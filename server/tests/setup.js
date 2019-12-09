'use strict';
const exec = require("child_process").exec;
require("custom-env").env(true);

/**
 * MAKE SURE THE TEST DATABASE (test_stockswatch) IS CREATED AND THAT THE SCHEMA HAS BEEN SET TO `stockswatch` OR THIS WILL FAIL
 */

// Test sql file path
const testSQLPath = "../postgres/stockswatch.sql";

// Prepares the test database
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