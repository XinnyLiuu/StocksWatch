import React from 'react';
import ReactDOM from 'react-dom';

import Unavailable from '../../components/alert/Unavailable.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

describe("Rendering Unavailable alert", () => {
	it('Renders Unavailable without crashing', () => {
		const div = document.createElement('div');

		ReactDOM.render(<Unavailable />, div);
		ReactDOM.unmountComponentAtNode(div);
	});
});

describe("Rendering Unavailable alert with message", () => {
	it('Displays the correct message', () => {
		const component = renderer.create(
			<Unavailable message="This is a test"></Unavailable>,
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
