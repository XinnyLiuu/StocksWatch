/**
 * Class representing user table
 */
'use strict';

class User {   
    constructor(id, firstName, lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getId() { 
        return this.id;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    setFirstName(firstName) {
        this.firstName = firstName;
    } 

    setLastName(lastName) {
        this.lastName = lastName;
    }
}