import React from 'react';
import { Alert } from 'react-bootstrap';

class Error extends React.Component {
    render() {
        return (
            <Alert variant="danger">
                <Alert.Heading>An Error Has Occurred</Alert.Heading>
                <p>{this.props.message}</p>
            </Alert>
        )
    }
}

export default Error;
