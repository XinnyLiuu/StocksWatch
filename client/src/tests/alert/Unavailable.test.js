import React from 'react';
import ReactDOM from 'react-dom';

import Unavailable from '../../components/alert/Unavailable.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

it('renders Unavailable without crashing', () => {
	const div = document.createElement('div');

	ReactDOM.render(<Unavailable />, div);
	ReactDOM.unmountComponentAtNode(div);
});

it('displays the correct message', () => {
	const component = renderer.create(
		<Unavailable message="This is a test"></Unavailable>,
	);
	let tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});