import React from 'react';
import {
    Form,
    Button
} from 'react-bootstrap';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    handleOnClick() { 
        
    }

    render() {
        return (
            <div id="login">
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter first name" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <Button variant="info" type="submit">
                        Register
                    </Button>
                </Form>
            </div>
        )
    }
}

export default Register;