import React from 'react';
import {
    Form,
    Button
} from 'react-bootstrap';
import {
    withRouter
} from 'react-router-dom';

import User from '../../model/User';
import {
    setSession
} from '../../utils/auth';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };

        // Bind methods
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
        this.toRegister = this.toRegister.bind(this);
    }

    handleChange(e) {
        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value
        });
    }

    // Takes the input values from the form to authenticate user
    login(e) {
        e.preventDefault();

        // Validate the inputs
        let username = this.state.username;
        let password = this.state.password;

        username = username.trim();
        password = password.trim();

        // Fire POST request
        let url = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/login`;

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then(resp => {
            resp.json().then(resp => {
                // Instantiate User
                const user = new User(resp.user_id, resp.username, resp.firstname, resp.lastname, true);

                // Set user session
                setSession(user);

                // Redirect to home
                this.props.history.push("/");
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }

    // Redirects user to /register
    toRegister() {
        this.props.history.push("/register");
    }

    render() {
        return (
            <div id="login">
                <Form onSubmit={this.login}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" placeholder="Enter username" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password" onChange={this.handleChange} />
                    </Form.Group>

                    <Button variant="info" type="submit">
                        Login
                    </Button>

                    <span className="space"></span>

                    <Button variant="outline-info" onClick={this.toRegister}>
                        Register
                    </Button>
                </Form>
            </div>
        )
    }
}

export default withRouter(Login);