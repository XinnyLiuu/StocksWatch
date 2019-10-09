'use strict';
const express = require('express');

// Create express server
const app = express();

// Services
const monthlyDataService = require('./services/monthly.js');

// Routes
app.get("/api/monthly/:symbol", monthlyDataService.getStockDataBySymbol); 