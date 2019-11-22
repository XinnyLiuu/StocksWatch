import React from 'react';
import ReactDOM from 'react-dom';
import Setting from '../../components/user/Setting.js';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';

jest.mock('../__mocks__/fetchUser')

describe('Login', () => {
  it('should render', () => {
    const component = shallow(<Setting />);
  
    expect(component).toMatchSnapshot();
  });
});