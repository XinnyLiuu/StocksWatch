'use strict';
const crypto = require("crypto");

/**
 * Hashes a password
 */
exports.encrypt = (password, salt) => {
    // Add the salt to the password
    password = salt + password;

    // Hash the salted password
    password = crypto.createHash("sha512").update(password).digest("hex");

    return password;
}

/**
 * Generate a random salt
 */
exports.getSalt = () => {
    return crypto.randomBytes(32).toString('hex');
}