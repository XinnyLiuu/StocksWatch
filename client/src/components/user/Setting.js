import React from 'react';
import {
	Form,
	Button
} from 'react-bootstrap';
import {
	withRouter
} from 'react-router-dom';

import Error from '../alert/Error';
import User from '../../model/User';

import {
	setSession
} from '../../utils/auth';
import {
	put
} from '../../utils/requests';

class Setting extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ogUsername: localStorage.getItem("username"),
			username: localStorage.getItem("username"),
			firstname: localStorage.getItem("firstname"),
			lastname: localStorage.getItem("lastname"),
			password: "",
			error: false,
			errMessage: "There has been an error updating your settings!"
		};

		this.handleChange = this.handleChange.bind(this);
		this.update = this.update.bind(this);
	}

	handleChange(e) {
		let name = e.target.name;
		let value = e.target.value;

		this.setState({ [name]: value })
	}

	async update(e) {
		e.preventDefault();

		let error = false;

		// Validate inputs
		let username = this.state.username;
		let password = this.state.password;
		let firstname = this.state.firstname;
		let lastname = this.state.lastname;

		username = username.trim().toLowerCase();
		password = password.trim();
		firstname = firstname.trim().toLowerCase();
		lastname = lastname.trim().toLowerCase();

		firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
		lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);

		if (username.length === 0 ||
			password.length === 0 ||
			firstname.length === 0 ||
			lastname.length === 0) {

			error = true;
			this.setState({ errMessage: "Please make sure none of the fields are empty!" });
		}

		if (!error) {
			// Prepare url and data
			const url = `${process.env.REACT_APP_put_settings_url}`;
			const data = JSON.stringify({
				"userId": localStorage.getItem("id"),
				"ogUsername": this.state.ogUsername,
				"username": username,
				"password": password,
				"firstname": firstname,
				"lastname": lastname
			});

			// Send UPDATE to server
			try {
				const resp = await put(url, data);

				// On 200 status
				if (resp.status === 200) {
					const json = await resp.json();

					// Update user in localStorage
					const user = new User(
						localStorage.getItem("id"),
						json.username,
						json.firstname,
						json.lastname,
						localStorage.getItem("isAuth"),
						JSON.parse(localStorage.getItem("stocks"))
					);

					setSession(user);

					this.setState({
						ogUsername: user.getUsername(),
						username: user.getUsername(),
						firstname: user.getFirstName(),
						lastname: user.getLastName()
					}, () => {
						this.props.history.push("/");
					})
				}

				// On 500 status
				if (resp.status === 500) throw new Error();
			} catch (err) {
				this.setState({ error: true });
			}
		}
		else {
			this.setState({ error: true })
		}
	}

	render() {
		return (
			<React.Fragment>
				{this.state.error ? <Error message={this.state.errMessage} /> : ""}

				<div id="settings">
					<Form onSubmit={this.update}>
						<Form.Group>
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" value={this.state.username} name="username" onChange={this.handleChange} />
						</Form.Group>

						<Form.Group>
							<Form.Label>First Name</Form.Label>
							<Form.Control type="text" value={this.state.firstname} name="firstname" onChange={this.handleChange} />
						</Form.Group>

						<Form.Group>
							<Form.Label>Last Name</Form.Label>
							<Form.Control type="text" value={this.state.lastname} name="lastname" onChange={this.handleChange} />
						</Form.Group>

						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" value={this.state.password} name="password" onChange={this.handleChange} />
						</Form.Group>

						<div className="buttons">
							<Button variant="info" type="submit">Update</Button>
						</div>
					</Form>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(Setting);
