import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from '../../components/highcharts/Wrapper.js';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';

describe('Wrapper', () => {
  it('should render', () => {
    const component = shallow(<Wrapper />);
  
    expect(component).toMatchSnapshot();
  });
});