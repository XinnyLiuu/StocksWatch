import React from 'react';
import ReactDOM from 'react-dom';
import StockChart from '../../components/highcharts/StockChart.js';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';

const mockData = {
  symbol: 'TEST',
  prices: {
    high: [10],
    low: [1]
  },
  currentPrice: 5,
  companyName: 'Test Inc.',
}

describe('StockChart', () => {
  it('should render with data', () => {
    const component = shallow(<StockChart data={mockData} />);
  
    expect(component).toMatchSnapshot();
  });

  it('should update when data is changed', () => {
    const component = mount(<StockChart data={mockData} />);
    component.setProps({ type: "single" })

    expect(component).toMatchSnapshot();
  });
});