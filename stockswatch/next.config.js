/**
 * Refer to https://nextjs.org/docs/api-reference/next.config.js/environment-variables
 * 
 * All environment variables for this application is listed below
 */

module.exports = {
    env: {
        // The following are endpoints pointing to lambdas

        // stocks-api
        get_yearly_stock_url: "https://ny7uz4m8qa.execute-api.us-east-1.amazonaws.com/dev/api/stocks/yearly/", // {stock}
        get_dow30_stock_url: "https://ny7uz4m8qa.execute-api.us-east-1.amazonaws.com/dev/api/stocks/dow30",
        post_user_watchlist_url: "https://ny7uz4m8qa.execute-api.us-east-1.amazonaws.com/dev/api/stocks/watchlist",
        get_symbols_url: "https://ny7uz4m8qa.execute-api.us-east-1.amazonaws.com/dev/api/stocks/symbols",
        get_companies_url: "https://ny7uz4m8qa.execute-api.us-east-1.amazonaws.com/dev/api/stocks/companies",
        get_symbol_by_company_url: "https://ny7uz4m8qa.execute-api.us-east-1.amazonaws.com/dev/api/stocks/convert/company/", // {company},
        get_company_by_symbol_url: "https://ny7uz4m8qa.execute-api.us-east-1.amazonaws.com/dev/api/stocks/convert/symbol/", // {symbol}

        // user-api
        post_login_url: "https://pvr3p4njrl.execute-api.us-east-1.amazonaws.com/dev/api/user/login",
        post_register_url: "https://pvr3p4njrl.execute-api.us-east-1.amazonaws.com/dev/api/user/register",
        post_add_user_stock_url: "https://pvr3p4njrl.execute-api.us-east-1.amazonaws.com/dev/api/user/watchlist",
        delete_user_stock_url: "https://pvr3p4njrl.execute-api.us-east-1.amazonaws.com/dev/api/user/watchlist",
        put_settings_url: "https://pvr3p4njrl.execute-api.us-east-1.amazonaws.com/dev/api/user/settings"
    }
}