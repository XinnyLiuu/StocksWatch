/** 
 * Exception class for handling any API errors
 */
`use strict`;

class APIException extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
    }
}

module.exports = APIException;