import React from 'react';
import ReactDOM from 'react-dom';
import Register from '../../components/user/Register.js';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';

jest.mock('../__mocks__/fetchUser')

describe('Register', () => {
	it('should render', () => {
		const component = shallow(<Register />);

		expect(component).toMatchSnapshot();
	});
});