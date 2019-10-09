'use strict';
const express = require('express');
const morgan = require('morgan');

// Create express server
const app = express();

// Setup logger
app.use(morgan(':date[iso] :status :method :url [:response-time ms] :remote-addr'));

// Start server
app.listen(8000);
console.log("Server running on port 8000");

// Services
const monthlyDataService = require('./services/monthly.js');

// Routes
app.get("/api/monthly/:symbol", monthlyDataService.getStockDataBySymbol);
console.log(app._router.stack[3]["route"]["path"]);