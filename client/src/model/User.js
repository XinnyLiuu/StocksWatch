class User {
    constructor(id, username, firstName, lastName, isAuth, stocks) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isAuth = isAuth;
        this.stocks = stocks;
    }

    getId() {
        return this.id;
    }

    getUsername() {
        return this.username;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getIsAuth() {
        return this.isAuth;
    }

    getStocks() {
        return this.stocks;
    }

    addStock(stock) {
        this.stocks.push(stock);
    }

    setFirstName(firstName) {
        this.firstName = firstName;
    }

    setLastName(lastName) {
        this.lastName = lastName;
    }
}

export default User;
