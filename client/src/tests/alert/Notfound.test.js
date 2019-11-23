import React from 'react';
import ReactDOM from 'react-dom';

import Notfound from '../../components/alert/Notfound.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

describe("Rendering Notfound alert", () => {
	it('Renders NotFound without crashing', () => {
		const div = document.createElement('div');

		ReactDOM.render(<Notfound />, div);
		ReactDOM.unmountComponentAtNode(div);
	});
});