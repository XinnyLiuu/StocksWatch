import React from 'react';
import ReactDOM from 'react-dom';

import Success from '../../components/alert/Success.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

describe("Rendering Success alert", () => {
	it('Renders Success without crashing', () => {
		const div = document.createElement('div');

		ReactDOM.render(<Success />, div);
		ReactDOM.unmountComponentAtNode(div);
	});
});

describe("Rendering Unavailable alert with message", () => {
	it('Displays the correct message', () => {
		const component = renderer.create(
			<Success message="This is a test"></Success>,
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});