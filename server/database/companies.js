'use strict';
const axios = require("axios");
const DB = require("./DB");
require("custom-env").env(true, "../");

const postgres = new DB();

/**
 * Since alot of our querying is through IEX, we are going to query their company list endpoint to load all symbols + company into our database. This allows us to have a store of symbols and their respective company name.
 */

async function dumpCompanies() {
    try {
        // Wipe companies for fresh state
        let query = {
            name: "drop-companies",
            text: "delete from companies"
        };

        const db = await postgres;
        let results = await db.delete(query);

        if (results.rowCount === 0) console.log("Table `companies` is empty!");

        // Get updated JSON from IEX api
        const url = "https://api.iextrading.com/1.0/ref-data/symbols";
        const response = await axios.get(url);

        if (response.status === 200) {
            let json = response.data; // Array of JSON
            json = json.filter(d => d.name !== "");

            // Dump symbol + name into DB
            let count = 0;
            json.forEach(async d => {
                const symbol = d.symbol;
                const name = d.name;

                query = {
                    name: "add-company",
                    text: "insert into companies (symbol, name) values ($1, $2) returning *",
                    values: [symbol, name]
                }

                try {
                    results = await db.insert(query);

                    if (results.rowCount > 0) {
                        count++;
                        console.log(`Inserted ${symbol} : ${name}`);
                    }
                } catch (err) {
                    console.log(err);
                }

                // Exit the program when all data has been dumped
                if (count === json.length) {
                    console.log("Done.")
                    process.exit(1);
                }
            });
        }
    } catch (err) {
        console.log(err);
    }
}

dumpCompanies();