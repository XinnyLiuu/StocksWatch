import React from 'react';
import {
    Alert
} from 'react-bootstrap';

class Unavailable extends React.Component {
    render() {
        return (
            <Alert variant="danger">
                <Alert.Heading>Service Unavailable</Alert.Heading>
                <p>{this.props.message}</p>
            </Alert>
        )
    }
}

export default Unavailable;
