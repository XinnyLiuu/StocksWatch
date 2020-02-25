import React from 'react';
import {
	Form,
	Button
} from 'react-bootstrap';
import Router from "next/router";

import Error from '../alert/Error';
import User from '../../model/User';

import { setSession } from '../../utils/auth';
import { post } from "../../utils/requests"

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			error: false
		};

		// Bind methods
		this.handleChange = this.handleChange.bind(this);
		this.login = this.login.bind(this);
		this.toRegister = this.toRegister.bind(this);
	}

	handleChange(e) {
		let name = e.target.name;
		let value = e.target.value;

		this.setState({ [name]: value });
	}

	// Takes the input values from the form to authenticate user
	async login(e) {
		e.preventDefault();

		// Validate the inputs
		let username = this.state.username;
		let password = this.state.password;

		username = username.trim().toLowerCase();
		password = password.trim();

		// Prepare data and url
		const data = JSON.stringify({
			"username": username,
			"password": password
		});

		let url = `${process.env.REACT_APP_SERVER_DOMAIN}/api/user/login`;

		// Fire POST request
		try {
			const resp = await post(url, data);

			// Check for 200
			if (resp.status === 200) {
				const json = await resp.json();

				// Instantiate User
				const user = new User(
					json.user_id,
					json.username,
					json.firstname,
					json.lastname,
					true,
					json.stocks
				);

				// Set user session
				setSession(user);

				// Redirect to home
				Router.push("/");
			}

			// On 500 status
			if (resp.status === 500) {
				this.setState({ error: true });
			}
		} catch (err) {
			this.setState({ error: true });
		}
	}

	// Redirects user to /register
	toRegister() {
		Router.push("/register");
	}

	render() {
		return (
			<React.Fragment>
				{this.state.error ? <Error message={"The username or password entered does not match our records. Please try agian!"} /> : ""}

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
			</React.Fragment>
		)
	}
}

export default Login;