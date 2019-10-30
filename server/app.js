'use strict';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Create express server
const app = express();

// Setup logger
app.use(morgan(':date[iso] :status :method :url [:response-time ms] :remote-addr'));

// Enable CORS for React
const corsOptions = {
    origin: process.env.REACT_DEV_DOMAIN
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Enable JSON POST
app.use(express.json());

// Start server
app.listen(process.env.PORT || 8000);
console.log(`Server running on port ${process.env.PORT || 8000}`);

// Services
const monthlyDataService = require('./services/monthly.js');
const dow30Service = require('./services/dow30.js');

// Database
const mysqlController = require('./controller/mysql.js');

// Routes
// Stock Data
app.get("/api/monthly/:symbol", monthlyDataService.getStockDataBySymbol);
app.get("/api/dow30", dow30Service.getStockDataForDow);

// Database
app.post("/api/login", mysqlController.postUserLogin);
app.post("/api/register", mysqlController.postUserRegister);
app.post("/api/watchlist/add", mysqlController.postAddStockWatchList);
