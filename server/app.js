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

// Routes
const apiRoutes = require("./routes/index");
app.use("/api", apiRoutes);

// Start server
app.listen(process.env.PORT || 8000);
console.log(`Server running on port ${process.env.PORT || 8000}`);