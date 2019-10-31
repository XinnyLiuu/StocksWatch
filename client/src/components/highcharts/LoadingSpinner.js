import React from 'react';
import {
    Spinner
} from 'react-bootstrap';

import '../../css/main.css';

class LoadingSpinner extends React.Component {
    render() {
        return (
            <div className="spinner">
                <Spinner className="spin" animation="border" variant="info" size="lg">
                </Spinner>
            </div>
        )
    }
}

export default LoadingSpinner;
