import React from 'react';
import {
    Alert
} from 'react-bootstrap';

class Unavailable extends React.Component {
    render() {
        return (
            <Alert variant="danger">
                <Alert.Heading>Service Unavailable</Alert.Heading>
                <p>There has been an error. Please try again.</p>
            </Alert>
        )
    }
}

export default Unavailable;
