import React from 'react';
import Wrapper from '../../components/highcharts/Wrapper.js';
import { shallow, mount, render } from 'enzyme';

describe('Rendering Wrapper', () => {
	it('Should render', () => {
		const component = shallow(<Wrapper />);

		expect(component).toMatchSnapshot();
	});
});