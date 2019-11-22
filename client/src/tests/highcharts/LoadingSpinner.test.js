import React from 'react';
import ReactDOM from 'react-dom';
import LoadingSpinner from '../../components/highcharts/LoadingSpinner.js';
import renderer from 'react-test-renderer';

// Error
it('renders component without crashing', () => {
  const div = document.createElement('div');
  
  ReactDOM.render(<LoadingSpinner />, div);
  ReactDOM.unmountComponentAtNode(div);
});
