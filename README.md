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

The scope of this project involves users being able to search, add and track stocks they are interested in. The stocks they follow with be projected into an interactive historical line graph using the HighCharts library. Users will be able to edit their stocks using CRUD operations via our client side application. Given that we are not using the premium features of the Intrinio API, the selection of the available stocks to track are within the restraint of stocks that are provided by the free tier API. 


## Project Requirements
* Companies names and stock tickers will be used to query the Intrinio API to return the data for that particular stock.
* All stocks will have a follow button to allow users to add that stock to their list and keep track of the stock’s prices for that company.
* Searches will be sent to our server which we will be sanitized and queried against the data from the Intrinio API. The selected data will be sent back to our client side in JSON format to be used with the HighCharts API to render a historical line graph for the user. 
* A historical line graph for the particular stock containing information such as prices and dates within a specific date range. 


## Business Rules / Constraints
* Users cannot track the same stocks twice
* Users need to be logged in / registered to track stocks or edit their preferences


## Design Patterns
* MVC Pattern 
	- The `Model` in our application will be inputs that are sent from our client to the server. When data is received by the server, it will pass the data to a controller which will then update an object representing a table in our database. The updated data will reflect on the client view.
	- The `View` in our application is our client side application. It displays data to the user through an UI. The user is able to interact with the view and send data from the client to server which will be processed by a controller and update our model.
	- The `Controller` in our application are all business logic that handles where data should go and performs the necessary action. When an input is received, the controller will perform CRUD actions on a table in database.

	__Example__: An user is on our application and is trying to add a stock to track. Upon clicking on the "Add" button, the name of the stock will be sent to our server through a HTTP POST request. The route that is mapped to the POST request will be associated to a controller in our server. The controller will then insert the stock to the user's list of tracked tracks. After the POST request is done being handled by the controller, the view will update the changes accordingly.

* Observer Pattern 
	- This pattern is crucial to our application as we want our UI to be interactive and seamless. Whenever the user performs an action, our UI should be notified of the change and show the changes. 

	__Example__: Similar to the example above, after the POST request is sent, our view will be notified that the model has changed and will show the added stock in the user's list of tracked stocks.


## Layering
StocksWatch is an client-server application and have the 3 following N-Tier archeticture tier:

__Note__: Given that we are using a JavaScript on both client and server, we are building this application through functional programming rather than imperative programming like in Java. We are, however, directly mapping data queried from the database in __[JavaScript ES6 classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)__.

* Presentation Layer
	- Our client is the presentation layer and allows for interactions with the user. It communicates with our application layer through `HTTP (GET/POST/PUT/DELETE) methods`. Our application layer exposes API endpoints by which the presentation layer can use. 

	- __Example__: User wants to see the Dow 30 companies. Our presentation layer (Angular / React) will send a `GET` request to an endpoint offered by our server `(/api/dow30)`. The server will receive the request, query the Alpha Vantage API, parse the data offered by the API, clean the data and return to the presentation layer a JSON object that the presentation layer can plug into an charts library to show to the user.

* Application Layer
	- Our server is the application layer. This layer processes all HTTP requests sent from our presentation layer. It will expose API endpoints that are mapped to a controller to handle the request. The controllers perform actions on the database layer therefore updating our model. 

	- __Example__: User wants to delete a stock that they are tracking on our presentation layer (Angular / React). The client will send a `HTTP DELETE request` to an endpoint on our server (`/api/:stock`, where :stock is the symbol belonging to the stock the user wants to delete. This parameter is hidden from the user). The endpoint is mapped to a controller function - `removeStockBySymbol()`, which will query the database with a `DELETE statement` from the user's table.

* Database Layer
	- Our database layer are code related to the database. Classes such as `DB`, `User`, `UserStocks` will be associated to a table in our database. The `DB` class will connect to the database and offer methods that peform CRUD actions on a table. The User class will be an Object representation of user data queried from our database. The User class will offer getters and setters that can allow our application to maintain the state of the User object. Likewise, the `UserStocks` class is an Object representing the list of stocks that the user is tracking.

	- __Example__: When our user adds a stock that they wish to track, the presentation layer will send a `POST` request to an endpoint exposed by our server. The endpoint (`/api/stock/:symbol`) will call the associated controller function that will create a new `UserStocks` class with the stock information and insert the data of that stock into the database using the getters and setters offered by that class. 


## Technologies Used
We plan to use the following technologies in our application: 

* __[Angular 8](https://angular.io/)__ - JavaScript framework used for our front end.
* __[HighCharts](https://www.highcharts.com/)__ - JavaScript library used to generate graphical charts.
* __[Node.js](https://nodejs.org/en/)__ - Javascript framework used for our back end. 
* __[MySQL](https://www.mysql.com/)__ - Relational database used to store our data.
* __[AlphaVantage](https://www.alphavantage.co/)__ - An API offering a wide selection of financial data related to Stocks and Cryptocurrencies.
* __[Pandas](https://pandas.pydata.org/)__ - Pandas is a data analytics and machine learning library written in Python. The machine learning will only be as good as it is trained, but it will be a cool feature nonetheless.

The following technologies may be used later down the line as we flesh out our design more.
* __[Electron](https://electronjs.org/)__ - An JavaScript desktop wrapper that enables web application to function as a desktop applicaiton. (Nice for resume).


## Timeline
* Milestone 3 - Layering - __due 10/11__
* Milestone 4 - Exception Handling - __due 10/25__
* Milestone 5 - Refactoring - __due 11/8__
* Milestone 6 - Testing - __due 11/22__
* Milestone 7 - Packaging - __due 12/6__