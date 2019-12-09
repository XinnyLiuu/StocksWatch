# StocksWatch

## Team Members and Roles
* Xin Liu - Full Stack Developer
* Benjamin Thorn - Front-end Developer  
* Terence Biney - Back-end Developer / DB Manager


## Background
Our application, StocksWatch, aims to provide historical snapshots of a year’s worth of stock data for our users. The application will provide an attractive UI and allows users to create accounts with us to keep track of the stocks they are interested in.


## Project Description 
StocksWatch will be a web application aimed to offer the best experience for our stakeholders. The application will allow users to:

* Create an account on our application and keep track of the stocks that choose to follow.
* Add to their own list of stocks that is offered by our platform. 
* Edit the stocks that are currently being tracked. 
* Enjoy seamless user experience. StocksWatch will be both desktop and mobile friendly so that our application be used anywhere with an internet connection.
* __TBD__: Show the future predictions of a price of a stock through the use of a machine learning library.

The scope of this project involves users being able to search, add and track stocks they are interested in. The stocks they follow with be projected into an interactive historical line graph using the HighCharts library. Users will be able to edit their stocks using CRUD operations via our client side application. Given that we are not using the premium features of various 3rd party stock APIs, the selection of the available stocks to track are within the restraint of stocks that are provided by the free tier API. 


## Project Requirements
* Companies names and stock tickers will be used to query the 3rd party APIs to return the data for that particular stock.
* All stocks will have a follow button to allow users to add that stock to their list and keep track of the stock’s prices for that company.
* Searches will be sent to our server which will be sanitized and queried. The selected data will be sent back to our client side in JSON format to be used with the HighCharts API to render a historical line graph for the user. 
* A historical line graph for the particular stock containing information such as prices and dates within a specific date range. 


## Business Rules / Constraints
* Users cannot track the same stocks twice
* Users need to be logged in / registered to track stocks or edit their preferences


## Design Patterns
* MVC Pattern 
	- The `Model` in our application will be data that exists in our client-server application. When data is received by the server, it will pass the data to a controller which will then update an object representing a table in our database. The updated data will reflect on the client view.
	- The `View` in our application is our client. It displays data to the user through an UI. The user is able to interact with the view and send data from the client to server which will be processed by a controller and update our model.
	- The `Controller` in our application are all business logic that handles where data should go and performs the necessary action. When an input is received, the controller will perform CRUD actions on a table in database.

	- __Example__: An user is on our application and is trying to add a stock to track. Upon clicking on the "`Add`" button, the name of the stock will be sent to our server through a `HTTP POST request`. The route that is mapped to the `POST request` will be associated to a controller in our server. The controller will then `insert` the stock to the user's list of tracked tracks. After the `POST request` is done being handled by the controller, the view will update the changes accordingly.

* Observer Pattern 
	- This pattern is crucial to our application as we want our UI to be interactive and seamless. Whenever the user performs an action, our UI should be notified of the change and show the changes. 

	- __Example__: Similar to the example above, after the `POST request` is sent, our view will be notified that the model has changed and will show the added stock in the user's list of tracked stocks.


## Layering
StocksWatch is a client-server application and have the 3 following `N-Tier archeticture` tiers:

__Note__: Given that we are using a JavaScript on both client and server, we are building this application through functional programming rather than imperative programming like in Java. We are, however, directly mapping data queried from the database using __[JavaScript ES6 classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)__.

* Presentation Layer
	- Our client is the presentation layer and allows for interactions with the user. It communicates with our application layer through `HTTP (GET/POST/PUT/DELETE) methods`. Our application layer exposes API endpoints by which the presentation layer can use. 

	- __Example__: User wants to see the Dow 30 companies - Our presentation layer  (React) will send a `GET` request to an endpoint offered by our server (`/api/stocks/dow30`). The server will receive the request, query an API, parse the data offered by the API, clean the data and return to the presentation layer a JSON object that the presentation layer can plug into a charts library to show to the user.

* Application Layer
	- Our server is the application layer. This layer processes all HTTP requests sent from our presentation layer. It will expose API endpoints that are mapped to a controller to handle the request. The controllers perform actions on the database layer whereby updating our model. 

	- __Example__: User wants to delete a stock that they are tracking on our presentation layer (React). The client will send a `HTTP DELETE request` to an endpoint on our server (`/api/:stock`), where `:stock` is the symbol belonging to the stock the user wants to delete. This parameter is hidden from the user. The endpoint is mapped to a controller function - `removeStockBySymbol()`, which will query the database with a `DELETE statement` and removes the stock from the `user_stocks` table.

* Database Layer
	- Our database layer are code related to the database. The `db` module will connect to the database and offer methods that peform CRUD actions on a table. 

	- __Example__: When our user adds a stock that they wish to track, the presentation layer will send a `POST` request to an endpoint exposed by our server. The endpoint (`/api/stock/:symbol`) will call the associated controller function insert the data of that stock into the database.

## Exception Handling
Since we are using a client-server architecture with two different technologies - `React` and `Node.js` respectively, exception handling in the client will be different than that of the server.

__Note__: Exceptions in JavaScript are similar to those of Java. Every exception is a variation of the __[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)__ object. Error objects need to be thrown and caught and dealth with. 

* __Client__: Our `React` client sends __[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)__ calls to our `Node.js` server for any data processing. The fetch api returns a __[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)__ object that determines the result of the aysnchronous event. The asynchronous event is resolved (success) or rejected (failure). In the event that our event is rejected, our application should either:
	* __Redirect the user to a `Not Found` page if the URL requested does not exist__
	* __Show the user that the data requested could not be displayed normally with a friendly error message__

	* __Example__: Our client is requesting data regarding the `DOW 30` from our server, but the server is having issues aggregating the data from the free tier plan of the Intrinio API. Upon receiving a error `500` HTTP status code, our React code should redirect the user to a page that states `Service is uncurrently unavailable, please try again later!`. 

The client should __NEVER__ show any stack traces to the user. 

* __Server__: Our `Node.js` server deals with many things including exposed endpoints for the client to consume and database operations. The database related code has been wrapped in a module called `db.js` below:

```javascript
const postgres = new Client({
    connectionString: process.env.DB_CONNECTION_STRING
});

postgres.connect(err => {
    if (err) console.log(err);
    else console.log("Connected to PostgreSQL!");
});

module.exports = {
    getUserSalt,
    getUserByUsernamePassword,
    getUserStocks,
    insertUser,
    insertUserStock,
    deleteUserStock,
    updateUser,
    getSymbols,
    getCompanies,
    getSymbolByCompany,
    getCompanyBySymbol,
    dropCompanies,
    addCompany
}

	...
}
```

In the module, each method returns a `Promise` object that will either resolve or reject the asynchronous action from the __[node-postgres](https://node-postgres.com/)__ npm module. On the event the database method has been rejected, the error will be caught and logged to the terminal; The server will then return a status code of `500` to the client. Below is the code for a snippet of this:

```javascript
...

catch (err) {
	console.log(err);
	return res.sendStatus(500);
}
```
Our code in the client, would then check if a status code of `500` is returned and if so - redirect the user to a `Service Unavailable` page or another one of the reasons stated in the client section above.


## Performance and Refactoring
In regards on code for refactoring, originally we were handling `Promises` with `then / catch`, but an issue arose where code became ugly and difficult to maintain as we added more and more features. As such, we replaced promise handling with __[async / await](https://javascript.info/async-await)__ to better manage the resolution of promises for asynchronous actions. 

Below is a snippet of code where `then / catch` were used:

```javascript
fetch(api).then(resp => {
	if (resp.status === 200) {
		resp.json().then(data => {
			this.setState({
				data: data
			})
		}).catch(err => {
			this.setState({
				error: true
			});
		})
	}

	if (resp.status === 500) {
		this.setState({
			error: true
		});
	}
}).catch(err => {
	this.setState({
		error: true
	});
})

```
Below does the same as the code above, but with `async / await`:

```javascript
try {
	const resp = await fetch(api);

	if (resp.status === 200) {
		const json = await resp.json();
		this.setState({
			data: json
		})
	}

	if (resp.status === 500) {
		this.setState({
			error: true
		});
	}
} catch (err) {
	this.setState({
		error: true
	})
}
```
Above can be found in `client/src/components/highcharts/Wrapper.js`. With `async / await`, the resolution of promises is called by `await` and if the promise returns a rejection, it is caught in a `try / catch` statement.

For performance refactoring, originally when the user would add a stock to their watchlist, we would validate the stock with a `GET` request to the 3rd party API each time to ensure that the user stock exists. We soon discovered that there is a __[HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD)__ which is similar to a `GET`, but only requests the headers of the resource. This is crucial in the sense that instead of our server downloading the entire body and header returned from the API, we simply need to query the API for the stock and check the header for a status code `200`. If the `HEAD` request to the API returns a `200` for the stock, then the resource exists and therefore the stock does too.

Below is a snippet of the `HEAD` request found in `server/service/api.js`:

```javascript
let yearly_data_url = IEX_URL;
yearly_data_url += `/${stock}/chart/1y`;
yearly_data_url += `?token=${IEX_KEY}`;

return new Promise((resolve, reject) => {
	axios.head(yearly_data_url).then(result => {
		if (result.status === 200) {
			resolve(true);
		}
	}).catch(err => {
		reject(err);
	})
})
```
 
In addition to both code and performance refactoring, we switched databases from `MySQL` to `PostgreSQL` as per instructions. Due to the fact that we wrote alot of our database related code inside of its own class to decouple its logic from other methods, the migrating from `MySQL` to `PostgreSQL` was smooth and achieved within a short time. 

We only have to switch database drivers and with the help of npm, we replaced the `mysql` module with the `node-postgres` module.

We used `prepared statements` to precompile SQL statements to ensure faster execution of quries and to resue the same SQL statments in batches.

Below is the database class we originally had for MySQL:

```javascript
const mysql = require('mysql');

class DB {
    constructor() {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            });

            this.connection.connect(err => {
                if (err) reject(err);

                console.log("Connected to MySQL!");
                resolve(this);
            });
        });
	}

...
```

Below is the updated class for PostgreSQL and prepared statement usage:

```javascript
query = {
            name: "validate-user",
            text: "select user_id, username, firstname, lastname from users where username = $1 and password = $2",
            values: [username, password]
        }
...
```


```javascript
const { Client } = require('pg');

class DB {
    constructor() {
        return new Promise((resolve, reject) => {
            this.connection = new Client({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            });

            this.connection.connect(err => {
                if (err) reject(err);
                else {
                    console.log("Connected to PostgreSQL!");
                    resolve(this);
                }
            });
        });
	}

...
```
With security becoming a major concern, we were wary of the management of user passwords. When we were using MySQL, we hashed the password string with the built in functionality of `sha256`, but that was not enough. As a result, we decided to use the __[crypto](https://nodejs.org/api/crypto.html)__ to help use generate a random salt of `32 bytes` before storing the hashed salt and password combination with `sha512` into the database. Upon registering onto our platform, users are given a salt that is unique to them.

Below is the code snippet of methods relating to the hashing and encryption of user passwords:

```javascript
exports.encrypt = (password, salt) => {
    password = salt + password;
    password = crypto.createHash("sha512").update(password).digest("hex");
    return password;
}

exports.getSalt = () => {
    return crypto.randomBytes(32).toString('hex');
}
```

## Testing
For testing our application, we ended up using __[Jest](https://jestjs.io/)__ and __[Enzyme](https://airbnb.io/enzyme/)__ for our client React application and `Jest` for our server Node.js application. 

Jest and Enzyme allows the usage of mock data and rendering of components without having to manually render each one via a browser. Every component and utility function are tested to ensure that everything does not break during the actual deployment of the code. 

The following is an example of testing a basic component:

```javascript
describe("Rendering Info alert", () => {
	it('Renders Info without crashing', () => {
		const div = document.createElement('div');

		ReactDOM.render(<Info />, div);
		ReactDOM.unmountComponentAtNode(div);
	});
});
```
The component is tested to make sure it can be rendered properly and without any errors.

For components that required data, we added mock data to ensure that they are rendered without any errors as well:

``` javascript
const mockData = {
	symbol: 'TEST',
	prices: {
		high: [10],
		low: [1]
	},
	currentPrice: 5,
	companyName: 'Test Inc.',
}

describe('Rendering Stockchart', () => {
	it('Should render with data', () => {
		const component = shallow(<StockChart data={mockData} />);
		expect(component).toMatchSnapshot();
	});

	it('Should update when data is changed', () => {
		const component = mount(<StockChart data={mockData} />);
		component.setProps({ type: "single" })
		expect(component).toMatchSnapshot();
	});
});
```

As mentioned above, we also made sure that the utility functions used for the client are tested. Due to the fact we are caching user information into the browser's localStorage, we used a mock object to representing the local storage.

The mock is as follows:

```javascript
const localStorageMock = (() => {
	var store = {};

	return {
		getItem: (key) => {
			return store[key] ? store[key] : null;
		},
		setItem: (key, value) => {
			store[key] = value.toString();
		},
		clear: () => {
			store = {};
		},
		removeItem: (key) => {
			delete store[key];
		}
	};
})();
```

The testing of the utility methods are as follows:

```javascript
describe('Checking auth utility', () => {
	it('Should check authentication', () => {
		expect(auth.isAuthenticated()).toBe(true);
	});

	it('Should get cached user data', () => {
		const user = auth.getUserInfo();
		expect(user.firstName + ' ' + user.lastName).toBe('Johnny Test');
	});

	it('Should set user data into session data', () => {
		const user = new User(2, 'Shenmue3', 'Ryo', 'Hazuki', false, mockStock)

		auth.setSession(user);

		expect(localStorageMock.getItem('firstname') + ' ' + localStorageMock.getItem('lastname')).toBe('Ryo Hazuki')
	});

	it('Should destroy the session', () => {
		auth.destroySession();

		expect(localStorageMock.getItem('isAuth')).toBe(null);
	});
});
```

For our server, in order to have a mock database, we created a database in Postgres called `test_stockswatch` and with the usage of Jest, everytime before the test suites run, the database is wiped and sample data is inputted to mimic how the application works realistically.

```javascript
const testSQLPath = "../test.sql";

function dumpTestSQL() {
    console.log("Setting up test database...");

    exec(`psql test_stockswatch < ${testSQLPath}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
    })
}

dumpTestSQL();
```

The tests for our API are given mock data for any endpoints involving `POST` request and `GET` requests are tested to ensure that the JSON being returned contained properties that are expected.

```javascript
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

...

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
```

## Deployment, Packaging
### Production
This application has already been deployed and can be accessed __[here](http://stockswatch.tk/)__.


### Docker
Ensure that __[Docker](https://www.docker.com/)__ is installed on the host machine. Before running please address the following:

- Change the `REACT_APP_SERVER_DOMAIN` environment variable under `/client/.env.production` to `http://localhost:8000`. 
	- The `Dockerfile` under `/client` builds the React application which defaults to use the variables defined under `.env.production`.

- The containers will use the host machine's port `5432` and `80` - the build will fail if those ports are in use.

- The included `docker-compose.dev.yml` file builds and prepares the containers necessary for this application to work locally.

Run: 
```
sudo docker-compose -f docker-compose.dev.yml build
sudo docker-compose -f docker-compose.dev.yml up& 
```

Use `sudo docker-compose -f docker-compose.dev.yml down` to stop the containers.

### Electron
Run:
```
npm install 
npm run electron
```

## Technologies Used
We plan to use the following technologies in our application: 

* __[React](https://reactjs.org/)__ - JavaScript framework used for our front end.
* __[HighCharts](https://www.highcharts.com/)__ - JavaScript library used to generate graphical charts.
* __[Node.js](https://nodejs.org/en/)__ - Javascript framework used for our back end. 
* __[PostgreSQL](https://www.postgresql.org/)__ - Relational database used to store our data.
* __[Intrinio](https://intrinio.com/)__ - An API offering a wide selection of financial data related to Stocks and Cryptocurrencies.
* __[IEX](https://iexcloud.io/docs/api/)__ - Another financial data API.
* __[Jest](https://jestjs.io/)__ - Testing framework for JavaScript applications.
*  __[Enzyme](https://airbnb.io/enzyme/)__ - Testing framework for React with the ability to render components.

The following technologies may be used later down the line as we flesh out our design more:
* __[Electron](https://electronjs.org/)__ - An JavaScript desktop wrapper that enables web application to function as a desktop applicaiton. (Nice for resume).
* __[Pandas](https://pandas.pydata.org/)__ - Pandas is a data analytics and machine learning library written in Python. The machine learning will only be as good as it is trained, but it will be a cool feature nonetheless.


## Database 
- __NOTE__: PostgreSQL should be installed with a role called `stockswatch` and database called `stockswatch`.

Backup: 
```
pg_dump stockswatch > stockswatch.sql
```

Restore:
```
cat stockswatch.sql | psql -U stockswatch
```