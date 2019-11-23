import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../../components/Header/Header.js';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';

jest.mock('../__mocks__/fetchUser')

describe('Header', () => {
	it('should render', () => {
		const component = shallow(<Header />);

		expect(component).toMatchSnapshot();
	});
});