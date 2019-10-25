const DB = require('../database/DB.js');
const DatabaseException = require("../exceptions/DatabaseException");

// Gets all users
exports.getUsers = () => {
    let mysql = new DB();

    mysql
        .then(db => {
            db.select("select * from users")
                .then(resp => {
                    let users = resp;
                    console.log(users);
                })
                .catch(err => {
                    try {
                        throw new DatabaseException("Error in query", err);
                    } catch (e) {
                        console.log(e);
                    }
                })
        })
        .catch(err => {
            try {
                throw new DatabaseException("Error in query", err);
            } catch (e) {
                console.log(e);
            }
        })
}