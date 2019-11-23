import React from 'react';
import Setting from '../../components/user/Setting.js';
import { shallow, mount, render } from 'enzyme';

jest.mock('../__mocks__/fetchUser')

describe('Rendering Settings', () => {
	it('Should render', () => {
		const component = shallow(<Setting />);

		expect(component).toMatchSnapshot();
	});
});