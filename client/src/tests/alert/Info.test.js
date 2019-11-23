import React from 'react';
import ReactDOM from 'react-dom';
import Info from '../../components/alert/Info.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

describe("Rendering Info alert", () => {
	it('Renders Info without crashing', () => {
		const div = document.createElement('div');

		ReactDOM.render(<Info />, div);
		ReactDOM.unmountComponentAtNode(div);
	});
});

describe("Rendering Info alert with message", () => {
	it('Displays the correct message', () => {
		const component = renderer.create(
			<Info header="Test" message="This is a test"></Info>,
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
