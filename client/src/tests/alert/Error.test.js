import React from 'react';
import ReactDOM from 'react-dom';
import Error from '../../components/alert/Error.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

describe("Rendering Error alert", () => {
	it('Renders Error without crashing', () => {
		const div = document.createElement('div');

		ReactDOM.render(<Error />, div);
		ReactDOM.unmountComponentAtNode(div);
	});
});

describe("Rendering Error alert with message", () => {
	it('Displays the correct message', () => {
		const component = renderer.create(
			<Error message="This is a test"></Error>,
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
