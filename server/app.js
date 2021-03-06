'use strict';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require("custom-env").env(true);

/**
 * Configs for Express
 */

// Create express server
const app = express();

// Setup logger
app.use(morgan(':date[iso] :status :method :url [:response-time ms] :remote-addr'));

// Enable CORS for React
const corsOptions = {
    origin: [process.env.REACT_DEV_DOMAIN, "http://stockswatch.tk"]
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Enable JSON for POST
app.use(express.json());

// Routes
const apiRoutes = require("./routes/index");
app.use("/api", apiRoutes);

module.exports = app;