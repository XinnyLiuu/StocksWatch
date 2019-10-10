DROP DATABASE IF EXISTS stockswatch;
CREATE DATABASE stockswatch;
USE stockswatch;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	user_id  INT(4) NOT NULL AUTO_INCREMENT,
	firstName VARCHAR(200),
	lastName VARCHAR(200),
	password VARCHAR(25),
	PRIMARY KEY(user_id)
)

DROP TABLE IF EXISTS user_stocks;

CREATE TABLE user_stocks (
	user_stocks_id INT(4) NOT NULL AUTO_INCREMENT,
	symbol VARCHAR(100),
	PRIMARY KEY(stock_pref_id),
	user_id INT(4) NOT NULL,
	CONSTRAINT stockpref_user_id_fk FOREIGN KEY (user_id) REFERENCES users (user_id)
)