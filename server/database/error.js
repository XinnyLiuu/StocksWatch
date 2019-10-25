/**
 * Class representing Exception/Error handling
 */

'use strict';

class CustomException extends Error{

	constructor(message){
		super(message)

		this.name = this.constructor.name;

	}
}

module.exports = CustomException