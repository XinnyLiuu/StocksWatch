import React from 'react';
import WatchlistCharts from '../../components/highcharts/WatchlistCharts.js';
import { shallow, mount, render } from 'enzyme';
import localStorageMock from '../__mocks__/localStorageMock.js'
import mockStock from '../__mocks__/mock_stock.json'

localStorageMock.setItem('stocks', JSON.stringify(mockStock));
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Rendering Watchlist', () => {
	it('Should render', () => {
		const component = mount(<WatchlistCharts />);

		expect(component).toMatchSnapshot();
	});
});