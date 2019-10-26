## Team Members and Roles
* Xin Liu - Full Stack Developer
* Benjamin Thorn - Front-end Developer  
* Terence Biney - Back-end Developer / DB Manager


## Background
Our application, StocksWatch, aims to provide historical snapshots of a year’s worth of stock data for our users. The application will provide a pretty UI and allows users to create accounts with us to keep track of the stocks they are interested in.


## Project Description 
StocksWatch will be a web application aimed to offer the best experience for our stakeholders. The application will allow users to:

* Create an account on our application and keep track of the stocks that choose to follow.
* Add to their own list of stocks that is offered by our platform. 
* Edit the stocks that are currently being tracked. 
* Enjoy seamless user experience. StocksWatch will be both desktop and mobile friendly so that our application be used anywhere with an internet connection.
* Show the future predictions of a price of a stock through the use of a Python Machine Learning Library (Pandas).

The scope of this project involves users being able to search, add and track stocks they are interested in. The stocks they follow with be projected into an interactive historical line graph using the HighCharts library. Users will be able to edit their stocks using CRUD operations via our client side application. Given that we are not using the premium features of the Alpha Vantage API, the selection of the available stocks to track are within the restraint of stocks that are provided by the free tier API. 


## Project Requirements
* Companies names and stock tickers will be used to query the Alpha Vantage API to return the data for that particular stock.
* All stocks will have a follow button to allow users to add that stock to their list and keep track of the stock’s prices for that company.
* Searches will be sent to our server which we will be sanitized and queried against the data from the Alpha Vantage API. The selected data will be sent back to our client side in JSON format to be used with the HighCharts API to render a historical line graph for the user. 
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

	- __Example__: User wants to see the Dow 30 companies - Our presentation layer  (React) will send a `GET` request to an endpoint offered by our server (`/api/dow30`). The server will receive the request, query the Alpha Vantage API, parse the data offered by the API, clean the data and return to the presentation layer a JSON object that the presentation layer can plug into a charts library to show to the user.

* Application Layer
	- Our server is the application layer. This layer processes all HTTP requests sent from our presentation layer. It will expose API endpoints that are mapped to a controller to handle the request. The controllers perform actions on the database layer whereby updating our model. 

	- __Example__: User wants to delete a stock that they are tracking on our presentation layer (React). The client will send a `HTTP DELETE request` to an endpoint on our server (`/api/:stock`), where `:stock` is the symbol belonging to the stock the user wants to delete. This parameter is hidden from the user. The endpoint is mapped to a controller function - `removeStockBySymbol()`, which will query the database with a `DELETE statement` and removes the stock from the `user_stocks` table.

* Database Layer
	- Our database layer are code related to the database. Classes such as `DB`, `User`, `UserStocks` will be associated to a table in our database. The `DB` class will connect to the database and offer methods that peform CRUD actions on a table. The `User` class will be an Object representation of user data queried from our database. The `User` class will offer getters and setters that can allow our application to maintain the state of the User object. Likewise, the `UserStocks` class is an Object representing the list of stocks that the user is tracking.

	- __Example__: When our user adds a stock that they wish to track, the presentation layer will send a `POST` request to an endpoint exposed by our server. The endpoint (`/api/stock/:symbol`) will call the associated controller function that will create a new `UserStocks` class with the stock information and insert the data of that stock into the database using the getters and setters offered by that class. 

## Exception Handling
Since we are using a client-server architecture with two different technologies - `React` and `Node.js` respectively, exception handling in the client will be different than that of the server.

__Note__: Exceptions in JavaScript are similar to those of Java. Every exception is a variation of the __[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)__ object. Error objects need to be thrown and caught and dealth with. 

* __Client__: Our `React` client sends __[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)__ calls to our `Node.js` server for any data processing. The fetch api returns a __[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)__ object that determines the result of the aysnchronous event. The asynchronous event is resolved (success) or rejected (failure). In the event that our event is rejected, our application should either:
	* __Redirect the user to a `Not Found` page if the URL requested does not exist__
	* __Show the user that the data requested could not be displayed normally with a friendly error message__

	* __Example__: Our client is requesting data regarding the `DOW 30` from our server, but the server is having issues aggregating the data from the free tier plan of the Intrinio API. Upon receiving a error `500` HTTP status code, our React code should redirect the user to a page that states `Service is uncurrently unavailable, please try again later!`. 

The client should __NEVER__ show any stack traces to the user. 

* __Server__: Our `Node.js` server deals with many things including exposed endpoints for the client to consume and database operations. The database related code has been wrapped in a class called `DB.js` below:

```javascript
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

    select(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (error, results, fields) => {
                if (error) reject(error);

                if (results.length > 0) {
                    resolve(results[0]);
                }
            });
        })
	}
	
	...
}
```

In the class, each method returns a `Promise` object that will either resolve or reject the asynchronous action from the __[mysql](https://www.npmjs.com/package/mysql)__ npm module. On the event the database method has been rejected, a custom exception class that has been created should be thrown, caught and logged to the terminal. Below is the code for `DatabaseException.js`:

```javascript
class DatabaseException extends Error {
	constructor(message, cause) {
		super(message)
		this.cause = cause;
	}
}
```

Below is a snippet that shows the handling of a Database exception:

```javascript
db.select("select * from users")
	.then(resp => {
		let users = resp;
	})
	.catch(err => {
		try {
			throw new DatabaseException("Error in query", err);
		} catch (e) {
			console.log(e);
		}
	});
```
In the snippet above, when `db.select("select * from users")` returns a promise that is rejected, the rejection reason is passed as `err`. `err` is then caught in the `catch` of the `then / catch` block, which is then passed and thrown in an instance of the `DatabaseException` exception. When the exception is caught, the program logs the rejection reason and the stack trace to the console. Since the server is hidden from the eyes of users, logging to the console is fine. However, in the case that the server is used by the client that requires an immediate response such as an API endpoint, we need to handle things differently.

Below is code that is used to expose an endpoint for the client to consume data regarding the monthly prices of a stock. 

```javascript
axios.get(monthly_data_url)
	.then(result => {
		...
	})
	.catch(err => {
		try {
			if (err) throw new APIException("Error in api service monthly.js", err);
		} catch (e) {
			console.log(e);
			return res.status(500).json({ Error: e.message });
		}
	})
```

When the server runs into an error and cannot return the data requested to the client, the rejection reason is caught and passed into a newly thrown `APIException` which is then logged into the console and `Express.js` (the library used for our web server) returns a `500` HTTP status code and a JSON message to the client: 

```json
{
	"Error": "Error in api service monthly.js"
}
```

Our code in the client, would then check if a status code of 500 is returned and if so - redirect the user to a `Service Unavailable` page or another one of the reasons stated in the client section above.


## Technologies Used
We plan to use the following technologies in our application: 

* __[React](https://reactjs.org/)__ - JavaScript framework used for our front end.
* __[HighCharts](https://www.highcharts.com/)__ - JavaScript library used to generate graphical charts.
* __[Node.js](https://nodejs.org/en/)__ - Javascript framework used for our back end. 
* __[MySQL](https://www.mysql.com/)__ - Relational database used to store our data.
* __[Alpha Vantage](https://www.alphavantage.co/)__ - An API offering a wide selection of financial data related to Stocks and Cryptocurrencies.

The following technologies may be used later down the line as we flesh out our design more:
* __[Electron](https://electronjs.org/)__ - An JavaScript desktop wrapper that enables web application to function as a desktop applicaiton. (Nice for resume).
* __[Pandas](https://pandas.pydata.org/)__ - Pandas is a data analytics and machine learning library written in Python. The machine learning will only be as good as it is trained, but it will be a cool feature nonetheless.


## Timeline
* Milestone 5 - Refactoring - __due 11/8__
* Milestone 6 - Testing - __due 11/22__
* Milestone 7 - Packaging - __due 12/6__


## Installation
- `npm install`
- `npm start` 