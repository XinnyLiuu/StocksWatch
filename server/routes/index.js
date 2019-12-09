'use strict';
const express = require('express');
const router = express.Router();

/**
 * All routes for this application will be specifed here
 */
const stocksRoute = require("./stocks");
const userRoute = require("./user");

router.use("/stocks", stocksRoute);
router.use("/user", userRoute);

module.exports = router;