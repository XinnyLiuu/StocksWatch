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
	- Model will be all the data in our application. (Users, List of Stocks, Stocks, etc.)
	- View will be the UI.
	- Controller will the link between the model and the view.
* Observer Pattern 
	- This pattern is crucial to our application as we want our UI to be interactive and seamless. Whenever the user performs an action, our UI should be notified of the change and show the changes. 

## Technologies Used
We plan to use the following technologies in our application: 
* __[Angular 8](https://angular.io/)__ - JavaScript framework used for our front end.
* __[HighCharts](https://www.highcharts.com/)__ - JavaScript library used to generate graphical charts.
* __[Spring Boot](https://spring.io/projects/spring-boot)__ - Java framework used for our back end. 
* __[MySQL](https://www.mysql.com/)__ - Relational database used to store our data.
* __[Intrinio](https://intrinio.com/)__ - An API offering a wide selection of financial data related to Stocks and Cryptocurrencies.
* __[Pandas](https://pandas.pydata.org/)__ - Pandas is a data analytics and machine learning library written in Python. The machine learning will only be as good as it is trained, but it will be a cool feature nonetheless.

The following technologies may be used later down the line as we flesh out our design more.
* __[AlphaVantage](https://www.alphavantage.co/)__ - Alternative for Intrinio. Has more stock data available for their free tier.
* __[Electron](https://electronjs.org/)__ - An JavaScript desktop wrapper that enables web application to function as a desktop applicaiton. (Nice for resume).

## Timeline
* Milestone 3 - Layering - __due 10/11__
* Milestone 4 - Exception Handling - __due 10/25__
* Milestone 5 - Refactoring - __due 11/8__
* Milestone 6 - Testing - __due 11/22__
* Milestone 7 - Packaging - __due 12/6__