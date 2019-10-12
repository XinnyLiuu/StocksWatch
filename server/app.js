'use strict';
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

// Create express server
const app = express();

// Setup logger
app.use(morgan(':date[iso] :status :method :url [:response-time ms] :remote-addr'));

// Enable CORS for React
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.REACT_DEV_DOMAIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Start server
app.listen(process.env.PORT || 8000);
console.log(`Server running on port ${process.env.PORT || 8000}`);

// Services
const monthlyDataService = require('./services/monthly.js');

// Routes
app.get("/api/monthly/:symbol", monthlyDataService.getStockDataBySymbol);