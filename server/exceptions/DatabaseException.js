/**
 * Exception class for handling any Database errors
 */
'use strict';

class DatabaseException extends Error {
	constructor(message, cause) {
		super(message)
		this.cause = cause;
	}
}

module.exports = DatabaseException;