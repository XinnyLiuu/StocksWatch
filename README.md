Milestone 1 - Requirements
Xin Liu; Benjamin Thorn; Terence Budu-Biney
September 15, 2019


---


## Summary


Our application, StocksWatch, aims to provide historical snapshots of a year’s worth of stock data for our users. The application will provide a pretty UI and allows users to create accounts with us to keep track of the stocks they are interested in.


We plan to use the following technologies in our application: 
* __[Angular 8](https://angular.io/)__ - JavaScript framework used for our front end.
* __[HighCharts](https://www.highcharts.com/)__ - JavaScript library used to generate graphical charts.
* __[Spring Boot](https://spring.io/projects/spring-boot)__ - Java framework used for our back end. 
* __[PostgreSQL](https://www.postgresql.org/)__ - Relational database used to store our data.


## Goals


StocksWatch will be a web application aimed to offer the best experience for our stakeholders. The application will allow users to:


* Create an account on our application to store their preferences and keep track of the stocks that choose to follow.


* Add to their own list of stocks that is offered by our platform. (Note: The stocks offered by our platform is reliant to the data offered by the free tier of the Intrinio API. See our data sources section below)


* Update their account preferences and edit the stocks that are currently being tracked. 


* Enjoy seamless user experience. StocksWatch will be both desktop and mobile friendly so that our application be used anywhere with an internet connection. 


## Stakeholders


- Users (Students, Amateurs, Investors)
	- Students would want to keep up with activities of the stock market for educational purposes.
	- Investors would want to compare and overlay different stocks on the stock market before investing their financial resources in buying or selling of stocks.
	- All users can view not only the current prices of a stock, but be able to see the historical data to predict market trends.


## Scope


The scope of this project involves users being able to search, add and track stocks they are interested in. The stocks they follow with be projected into an interactive historical line graph using the HighCharts library. Users will be able to edit their stocks using CRUD operations via our client side application. Given that we are not using the premium features of the Intrinio API, the selection of the available stocks to track are within the restraint of stocks that are provided by the free tier API. 


## Input 


* Companies names will be used to query the Intrinio API to return the data for that particular Stock.


* All stocks will have a follow button to allow users to add that stock to their list and keep track of the stock’s prices for that company.


## Processing


* Searches (by company names) will be sent to our server which we will be sanitized and queried against the data from the Intrinio API. The selected data will be sent back to our client side in JSON format to be used with the HighCharts API to render a historical line graph for the user. 


## Output


* A historical line graph for the particular stock containing information such as prices and dates within a year of the current date selected. 


## Data Source


* __[Intrinio](https://intrinio.com/)__ - An API offering a wide selection of financial data related to Stocks and Cryptocurrencies.