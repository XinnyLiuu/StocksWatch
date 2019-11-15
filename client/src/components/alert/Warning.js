import React from 'react';
import {
    Alert
} from 'react-bootstrap';

class Warning extends React.Component {
    render() {
        return (
            <Alert variant="warning">
                <Alert.Heading>{this.props.header}</Alert.Heading>
                {this.props.message}
            </Alert>
        )
    }
}

export default Warning;
