'use strict';
const request = require("supertest");
const app = require("../app");

/**
 * Test all user related endpoints in our api using Jest and Supertest
 *
 * https://www.npmjs.com/package/supertest
 * https://jestjs.io/
 *
 * /api
 *      /user
 *	 		POST /register
 * 	        POST /login
 * 			POST /watchlist
 * 			DELETE /watchlist
 * 			PUT /settings
 */


// POST /api/user/register
describe("Register user", () => {
	test('Should get 200 status and id', async (done) => {
		let body = {
			username: 'test',
			password: 'test',
			firstname: 'test',
			lastname: 'test'
		};

		const response = await request(app)
			.post("/api/user/register")
			.set("Content-Type", "application/json")
			.send(body);

		const data = response.body;

		expect(response.statusCode).toBe(200);
		expect(data.id).not.toBeNull();
		done();
	})
});

// POST /api/user/login
describe("Login user", () => {
	test('Should get 200 status and user data', async (done) => {
		let body = { username: 'test', password: 'test' };

		const response = await request(app)
			.post("/api/user/login")
			.set("Content-Type", "application/json")
			.send(body);

		const data = response.body;

		expect(response.statusCode).toBe(200);
		expect(data.username).toBe("test");
		done();
	})
});

// POST /api/user/watchlist
describe("Add to watchlist", () => {
	test("Should get 200 status and stock symbol", async (done) => {
		let body = { stock: 'HUBS', userId: '5', username: 'test' };

		const response = await request(app)
			.post("/api/user/watchlist")
			.set("Content-Type", "application/json")
			.send(body);

		const data = response.body;

		expect(response.statusCode).toBe(200);
		expect(data.symbol).toBe("HUBS");
		done();
	})
})

// DELETE /api/user/watchlist
describe("Delete from watchlist", () => {
	test("Should get 200 status and stock symbol", async (done) => {
		let body = { stock: 'HUBS', userId: '5' };

		const response = await request(app)
			.delete("/api/user/watchlist")
			.set("Content-Type", "application/json")
			.send(body);

		const data = response.body;

		expect(response.statusCode).toBe(200);
		expect(data.symbol).toBe("HUBS");
		done();
	})
})

// PUT /api/user/settings - currently broken
describe("Update user", () => {
	test("Should get 200 status and user information", async (done) => {
		let body = {
			userId: "5",
			ogUsername: "test",
			username: "NEW_TEST",
			password: "test",
			firstname: "NEW_TEST",
			lastname: "NEW_TEST"
		}

		const response = await request(app)
			.put("/api/user/settings")
			.set("Content-Type", "application/json")
			.send(body);

		const data = response.body;

		expect(response.statusCode).toBe(200);
		expect(data.username).toBe(body.username);
		expect(data.firstname).toBe(body.firstname);
		expect(data.lastname).toBe(body.lastname);
		done()
	})
})