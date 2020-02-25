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

class Register extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			firstname: '',
			lastname: '',
			error: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.register = this.register.bind(this);
		this.toLogin = this.toLogin.bind(this);
	}

	handleChange(e) {
		let name = e.target.name;
		let value = e.target.value;

		this.setState({ [name]: value });
	}

	// Takes the input in the form to register the user
	async register(e) {
		e.preventDefault();

		// Validate inputs
		let username = this.state.username.trim().toLowerCase();
		let password = this.state.password.trim();
		let firstname = this.state.firstname.trim().toLowerCase();
		let lastname = this.state.lastname.trim().toLowerCase();

		firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
		lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);

		// Prepare data and url
		const data = JSON.stringify({
			"username": username,
			"password": password,
			"firstname": firstname,
			"lastname": lastname
		});
		const url = `${process.env.REACT_APP_SERVER_DOMAIN}/api/user/register`;

		// Fire POST request
		try {
			const resp = await post(url, data);

			// On 200 status
			if (resp.status === 200) {
				const json = await resp.json();
				let id = json.id;

				// Instantiate User
				const user = new User(
					id,
					username,
					firstname,
					lastname,
					true,
					[]
				);

				// Set user session
				setSession(user);

				// Redirect to home
				Router.push("/");
			}

			// On 500 status
			if (resp.status === 500) this.setState({ error: true });
		} catch (err) {
			this.setState({ error: true });
		}
	}

	// Redirects user to /login
	toLogin() {
		Router.push("/login");
	}

	render() {
		return (
			<React.Fragment>
				{this.state.error ? <Error message={"There has been an error registering your information. Please try again!"} /> : ""}

				<div id="login">
					<Form onSubmit={this.register}>
						<Form.Group>
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" placeholder="Enter username" name="username" onChange={this.handleChange} />
						</Form.Group>

						<Form.Group>
							<Form.Label>First Name</Form.Label>
							<Form.Control type="text" placeholder="Enter first name" name="firstname" onChange={this.handleChange} />
						</Form.Group>

						<Form.Group>
							<Form.Label>Last Name</Form.Label>
							<Form.Control type="text" placeholder="Enter last name" name="lastname" onChange={this.handleChange} />
						</Form.Group>

						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange} />
						</Form.Group>

						<Button variant="info" type="submit">
							Register
                    	</Button>

						<span className="space"></span>

						<Button variant="outline-info" onClick={this.toLogin}>
							Login
                    	</Button>
					</Form>
				</div>
			</React.Fragment>
		)
	}
}

export default Register;