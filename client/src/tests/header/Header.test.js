import React from 'react';
import Header from '../../components/header/Header.js';
import { shallow, mount, render } from 'enzyme';

jest.mock('../__mocks__/fetchUser')

describe('Rendering Header', () => {
	it('Should render Header without errors', () => {
		const component = shallow(<Header />);
		expect(component).toMatchSnapshot();
	});
});