import React from 'react';
import {
    Alert
} from 'react-bootstrap';

class Notfound extends React.Component {
    render() {
        return (
            <Alert variant="danger">
                <Alert.Heading>Oops! Something Unexpected Has Occured!</Alert.Heading>
            </Alert>
        )
    }
}

export default Notfound;
