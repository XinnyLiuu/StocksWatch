import React from 'react';
import StockChart from '../../components/highcharts/StockChart.js';
import { shallow, mount, render } from 'enzyme';

const mockData = {
	symbol: 'TEST',
	prices: {
		high: [10],
		low: [1]
	},
	currentPrice: 5,
	companyName: 'Test Inc.',
}

describe('Rendering Stockchart', () => {
	it('Should render with data', () => {
		const component = shallow(<StockChart data={mockData} />);
		expect(component).toMatchSnapshot();
	});

	it('Should update when data is changed', () => {
		const component = mount(<StockChart data={mockData} />);
		component.setProps({ type: "single" })
		expect(component).toMatchSnapshot();
	});
});