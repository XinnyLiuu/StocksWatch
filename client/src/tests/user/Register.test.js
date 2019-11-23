import React from 'react';
import Register from '../../components/user/Register.js';
import { shallow, mount, render } from 'enzyme';

jest.mock('../__mocks__/fetchUser')

describe('Rendering Register', () => {
	it('Should render', () => {
		const component = shallow(<Register />);

		expect(component).toMatchSnapshot();
	});
});