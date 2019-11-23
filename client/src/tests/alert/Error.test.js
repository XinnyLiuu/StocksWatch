import React from 'react';
import ReactDOM from 'react-dom';
import Error from '../../components/alert/Error.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

// Error
it('renders Error without crashing', () => {
	const div = document.createElement('div');

	ReactDOM.render(<Error />, div);
	ReactDOM.unmountComponentAtNode(div);
});

it('displays the correct message', () => {
	const component = renderer.create(
		<Error message="This is a test"></Error>,
	);
	let tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});