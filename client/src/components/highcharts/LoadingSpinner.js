import React from 'react';
import {
    Spinner

} from 'react-bootstrap';

import '../../css/main.css';

class LoadingSpinner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="spinner">
                <Spinner className="spin" animation="border" variant="info" size="lg">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        )
    }
}

export default LoadingSpinner;
