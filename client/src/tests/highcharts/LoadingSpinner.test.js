import React from 'react';
import ReactDOM from 'react-dom';
import LoadingSpinner from '../../components/highcharts/LoadingSpinner.js';

describe("Rendering Loading Spinner", () => {
	it('Renders component without crashing', () => {
		const div = document.createElement('div');

		ReactDOM.render(<LoadingSpinner />, div);
		ReactDOM.unmountComponentAtNode(div);
	});
});
