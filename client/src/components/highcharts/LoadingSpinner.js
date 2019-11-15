import React from 'react';
import {
    Spinner
} from 'react-bootstrap';

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
