/**
 * Class representing user_stocks in table
 */
'use strict';

class UserStocks {
    constructor(symbol, userId) {
        this.symbol = symbol;
        this.userId = userId;
    }

    getSymbol() {
        return this.symbol;
    }
}