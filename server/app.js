'use strict';
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

// Create express server
const app = express();

// Setup logger
app.use(morgan(':date[iso] :status :method :url [:response-time ms] :remote-addr'));

// Start server
app.listen(process.env.PORT);
console.log(`Server running on port ${process.env.PORT}`);

// Services
const monthlyDataService = require('./services/monthly.js');

// Routes
app.get("/api/monthly/:symbol", monthlyDataService.getStockDataBySymbol);
console.log(app._router.stack[3]["route"]["path"]);