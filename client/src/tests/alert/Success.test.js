import React from 'react';
import ReactDOM from 'react-dom';

import Success from '../../components/alert/Success.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

// Success
it('renders Success without crashing', () => {
  const div = document.createElement('div');
  
  ReactDOM.render(<Success />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('displays the correct message', () => {
  const component = renderer.create(
    <Success message="This is a test"></Success>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});