'use strict';
const request = require("supertest");
const app = require("../app");

/**
 * Test all stock related endpoints in our api using Jest and Supertest
 *
 * https://www.npmjs.com/package/supertest
 * https://jestjs.io/
 *
 * /api
 * 		/stocks
 * 			GET /yearly/:stock
 * 			GET /dow30
 * 			POST /watchlist
 * 			GET /symbols
 * 			GET /companies
 * 			GET /convert/company/:company
 * 			GET /convert/symbol/:symbol
 */

// GET /api/stocks/yearly/:stock
describe("Get yearly data for MSFT", () => {
    test('Should get 200 status and data', async (done) => {
        const response = await request(app).get("/api/stocks/yearly/MSFT");

        const data = response.body;

        expect(response.statusCode).toBe(200);
        expect(data.hasOwnProperty("symbol") === "MSFT")
        expect(data.hasOwnProperty("prices"))
        done();
    });
});

// GET /api/stocks/dow30
describe("Get data for DOW30", () => {
    test('Should get 200 status', async (done) => {
        const response = await request(app).get("/api/stocks/dow30");

        const data = response.body;

        expect(response.statusCode).toBe(200);
        expect(data.hasOwnProperty("DOW30"));
        done();
    });
});

// POST /api/stocks/watchlist
let body = { watchlist: '["HUBS"]' };

describe("Get data for stocks in user watchlist", () => {
    test("Should get 200 status", async (done) => {
        const response = await request(app)
            .post("/api/stocks/watchlist")
            .set("Content-Type", "application/json")
            .send(body);

        const data = response.body;

        expect(response.statusCode).toBe(200);
        expect(data.hasOwnProperty("watchlist"));
        done();
    });
});

// GET /api/stocks/symbols
describe("Get all stocks symbol", () => {
    test('Should get 200 status', async (done) => {
        const response = await request(app).get("/api/stocks/symbols");

        expect(response.statusCode).toBe(200);
        done();
    });
});

// GET /api/stocks/companies
describe("Get all stocks company", () => {
    test('Should get 200 status', async (done) => {
        const response = await request(app).get("/api/stocks/companies");

        expect(response.statusCode).toBe(200);
        done();
    });
});

// GET /api/stocks/convert/company/:company
describe("Get symbol by company", () => {
    test('Should get 200 status and body', async (done) => {
        const response = await request(app).get("/api/stocks/convert/company/HUBSPOT%20INC");

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe("HUBS");
        done();
    });
});

// GET /api/stocks/convert/symbol/:symbol
describe("Get company by symbol", () => {
    test('Should get 200 status and body', async (done) => {
        const response = await request(app).get("/api/stocks/convert/symbol/HUBS");

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe("HUBSPOT INC");
        done();
    });
});



