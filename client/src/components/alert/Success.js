import React from 'react';
import {
    Alert
} from 'react-bootstrap';

class Success extends React.Component {
    render() {
        return (
            <Alert variant="success">
                <Alert.Heading>Success!</Alert.Heading>
                <p>{this.props.message}</p>
            </Alert>
        )
    }
}

export default Success;
