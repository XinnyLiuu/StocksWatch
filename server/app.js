'use strict';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require("custom-env").env(true);

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

// Enable JSON for POST
app.use(express.json());

// Start server
app.listen(process.env.PORT || 8000);
console.log(`Server running on port ${process.env.PORT || 8000}`);

// Services
const stockService = require('./service/stock');

// Database
const dbController = require('./controller/database');

// Routes
// Stock Data
app.get("/api/monthly/:symbol", stockService.getStockDataBySymbol);
app.get("/api/dow30", stockService.getStockDataForDow);
app.post("/api/watchlist/stocks", stockService.postWatchlistStocks);

// Database
app.post("/api/login", dbController.postUserLogin);
app.post("/api/register", dbController.postUserRegister);
app.post("/api/watchlist/add", dbController.postAddStockWatchList);
app.delete("/api/watchlist/remove", dbController.deleteRemoveStockWatchList);
app.put("/api/user", dbController.putUserSettings);
app.get("/api/symbols", dbController.getSymbols);
app.get("/api/companies", dbController.getCompanies);
app.get("/api/convert/company/:company", dbController.getSymbolByCompany);
app.get("/api/convert/symbol/:symbol", dbController.getCompanyBySymbol);