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
                <Spinner animation="border" variant="info">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        )
    }
}

export default LoadingSpinner;
