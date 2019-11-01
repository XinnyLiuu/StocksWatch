import React from 'react';
import {
    Alert
} from 'react-bootstrap';

class Notfound extends React.Component {
    render() {
        return (
            <Alert variant="danger">
                <Alert.Heading>Page Not Found</Alert.Heading>
                <p>The page you are looking for does not exist!</p>
            </Alert>
        )
    }
}

export default Notfound;
