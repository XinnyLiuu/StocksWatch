import React from 'react';
import Login from '../../components/user/Login.js';
import { shallow, mount, render } from 'enzyme';

jest.mock('../__mocks__/fetchUser')

describe('Rendering Login', () => {
	it('Should render', () => {
		const component = shallow(<Login />);

		expect(component).toMatchSnapshot();
	});
});