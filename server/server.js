'use strict';
const app = require("./app");

// Start server
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${process.env.PORT || 8000}`);
});
