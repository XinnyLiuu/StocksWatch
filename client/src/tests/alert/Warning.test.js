import React from 'react';
import ReactDOM from 'react-dom';

import Warning from '../../components/alert/Warning.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

describe("Rendering Warning alert", () => {
	it('Renders Warning without crashing', () => {
		const div = document.createElement('div');

		ReactDOM.render(<Warning />, div);
		ReactDOM.unmountComponentAtNode(div);
	});
});

describe("Rendering Unavailable alert with message", () => {
	it('Displays the correct message', () => {
		const component = renderer.create(
			<Warning header="Test" message="This is a test"></Warning>,
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
