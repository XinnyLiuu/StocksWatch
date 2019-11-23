import React from 'react';
import ReactDOM from 'react-dom';
import Info from '../../components/alert/Info.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

it('renders Info without crashing', () => {
	const div = document.createElement('div');

	ReactDOM.render(<Info />, div);
	ReactDOM.unmountComponentAtNode(div);
});

it('displays the correct message', () => {
	const component = renderer.create(
		<Info header="Test" message="This is a test"></Info>,
	);
	let tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});