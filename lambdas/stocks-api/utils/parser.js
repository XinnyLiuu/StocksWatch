'use strict';

/**
 * Parses data from intrinio
 */
exports.intrinioParser = (data) => {
    let json = {
        "symbol": data.security.ticker,
        "prices": {
            "high": [], // [date, high]
            "low": [] // [date, low]
        }
    };

    let prices = data.stock_prices;
    prices.forEach(p => {
        let date = new Date(p.date).getTime();

        let high_arr = [];
        let low_arr = [];

        high_arr.push(date);
        high_arr.push(p.high);

        low_arr.push(date);
        low_arr.push(p.low);

        json.prices.high.push(high_arr);
        json.prices.low.push(low_arr);
    });

    return json;
}

/**
 * Parses data from IEX
 */
exports.IEXParser = (data, s) => {
    let json = {
        "symbol": s,
        "prices": {
            "high": [], // [date, high]
            "low": [] // [date, low]
        }
    };

    data.forEach(p => {
        let date = new Date(p.date).getTime();

        let high_arr = [];
        let low_arr = [];

        high_arr.push(date);
        high_arr.push(p.high);

        low_arr.push(date);
        low_arr.push(p.low);

        json.prices.high.push(high_arr);
        json.prices.low.push(low_arr);
    });

    json.prices.high.reverse();
    json.prices.low.reverse();

    return json;
}