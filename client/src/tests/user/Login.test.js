import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../../components/user/Login.js';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';

jest.mock('../__mocks__/fetchUser')

describe('Login', () => {
  it('should render', () => {
    const component = shallow(<Login />);
  
    expect(component).toMatchSnapshot();
  });
});