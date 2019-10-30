import React from 'react';
import {
    Form,
    Button
} from 'react-bootstrap';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
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
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <Button variant="info" type="submit">
                        Login
                    </Button>

                    <span class="space"></span> 

                    <Button variant="outline-info">
                        Register
                    </Button>
                </Form>
            </div>
        )
    }
}

export default Login;