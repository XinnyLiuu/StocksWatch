import React from 'react';
import ReactDOM from 'react-dom';

import Warning from '../../components/alert/Warning.js';

import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';

it('renders Warning without crashing', () => {
  const div = document.createElement('div');
  
  ReactDOM.render(<Warning />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('displays the correct message', () => {
  const component = renderer.create(
    <Warning header="Test" message="This is a test"></Warning>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});