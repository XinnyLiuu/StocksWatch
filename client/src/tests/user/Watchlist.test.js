import React from 'react';
import Watchlist from '../../components/user/Watchlist.js';
import { shallow, mount, render } from 'enzyme';
import localStorageMock from '../__mocks__/localStorageMock.js'
import mockStock from '../__mocks__/mock_stock.json'

localStorageMock.setItem('stocks', JSON.stringify(mockStock));
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Rendering Watchlist', () => {
	it('Should render', () => {
		const component = shallow(<Watchlist />);

		expect(component).toMatchSnapshot();
	});
});