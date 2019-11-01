import React from 'react';
import {
    Alert
} from 'react-bootstrap';

class GenericError extends React.Component {
    render() {
        return (
            <Alert variant="danger">
                <Alert.Heading>An Error Has Occurred</Alert.Heading>
                <p>There has been an error. Please try again.</p>
            </Alert>
        )
    }
}

export default GenericError;
