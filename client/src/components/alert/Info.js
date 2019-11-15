import React from 'react';
import {
    Alert
} from 'react-bootstrap';

class Info extends React.Component {
    render() {
        return (
            <Alert variant="info">
                <Alert.Heading>{this.props.header}</Alert.Heading>
                {this.props.message}
            </Alert>
        )
    }
}

export default Info;
