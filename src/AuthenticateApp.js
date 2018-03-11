import React, { Component } from 'react';
import { Alert, Button, Col, ControlLabel, Form, FormControl, FormGroup, Modal } from 'react-bootstrap';
import axios from 'axios';


function authenticateUser(username, password) {
  const url = 'http://localhost:8080/auth';
  const authData = {
    'username': username,
    'password': password
  };
  const config = {
    headers: {
      'content-type': 'application/json'
    }
  };
  return axios.post(url, authData, config);
}


class LoginModal extends Component {
  constructor(props) {
    super(props);

    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);

    this.loginUser = this.loginUser.bind(this);

    this.renderAlert = this.renderAlert.bind(this);

    this.state = {
      username: null,
      usernameStatus: null,
      password: null,
      passwordStatus: null,
      alertClass: 'hide-alert',
      alertMessages: []
      //Might want to put the fieldStatus method into state to detect changes?
    }
  }

  setUsername(event) {
    event.preventDefault();
    this.setState({
      username: event.target.value
    });
  }

  setPassword(event) {
    event.preventDefault();
    this.setState({
      password: event.target.value
    });
  }

  loginUser() {
    if (!this.state.username || !this.state.password) {
      let statuses = {
        alertClass: 'show-alert',
        alertMessages: []
      };
      if (!this.state.username) {
        statuses['usernameStatus'] = 'error';
        statuses['alertMessages'].push('No username provided')
      }
      if (!this.state.password) {
        statuses['passwordStatus'] = 'error';
        statuses['alertMessages'].push('No password provided')
      }
      this.setState(statuses);
      return;
    }

    authenticateUser(this.state.username, this.state.password).then(
      (response) => {
        this.props.authenticate(response.data.access_token);
        this.props.loginUser({user_id: response.data.user_id});
        this.props.closeModal();
      }
    ).catch(
      (error) => {
        let alerts = [error.response.data];
        this.setState({
          alertClass: 'show-alert',
          alertMessages: alerts
        })
      }
    );
  }

  renderAlert() {
    return (
      <Alert bsStyle="danger">
        {
          this.state.alertMessages.map((item, index) => (
            <p className="list-item" key={'login-alert-' + index}>
              Error: { item }
            </p>
          ))
        }
      </Alert>
    )
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
          <div className={this.state.alertClass}>
          {this.renderAlert()}
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup validationState={this.state.usernameStatus}  controlId="formHorizontalLoginUsername">
              <Col componentClass={ControlLabel} sm={2}>
                Username
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.setUsername} type="text" placeholder="loginUsername" />
              </Col>
            </FormGroup>

            <FormGroup validationState={this.state.passwordStatus}  controlId="formHorizontalLoginPassword">
              <Col componentClass={ControlLabel} sm={2}>
                Password
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.setPassword} type="password" placeholder="loginPassword" />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} >Close</Button>
          <Button onClick={this.loginUser} bsStyle="primary">Login</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


class RegisterModal extends Component {
  constructor(props) {
    super(props);

    this.setUsername = this.setUsername.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setAboutMe = this.setAboutMe.bind(this);
    this.selectImageFile = this.selectImageFile.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.renderAlert = this.renderAlert.bind(this);

    this.state = {
      username: null,
      usernameStatus: null,
      email: null,
      emailStatus: null,
      password: null,
      passwordStatus: null,
      about_me: null,
      image_file: null,
      alertClass: 'hide-alert',
      alertMessages: []
    }
  }

  registerUser(event) {
    event.preventDefault();
    this.setState({submit: true});
    if(!this.state.username || !this.state.password || !this.state.email) {
      let statuses = {
        alertClass: 'show-alert',
        alertMessages: []
      };
      if(!this.state.username) {
        statuses['usernameStatus'] = 'error';
        statuses['alertMessages'].push('No username provided');
      }
      if(!this.state.email) {
        statuses['emailStatus'] = 'error';
        statuses['alertMessages'].push('No email provided');
      }
      if(!this.state.password) {
        statuses['passwordStatus'] = 'error';
        statuses['alertMessages'].push('No password provided');
      }
      this.setState(statuses);
      return;
    }

    const url = 'http://localhost:8080/account/create';
    const formData = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    formData.append('username', this.state.username);
    formData.append('email', this.state.email);
    formData.append('password', this.state.password);
    if(this.state.about_me) {
      formData.append('about_me', this.state.about_me);
    }
    if(this.state.image_file) {
      formData.append('profile_pic', this.state.image_file);
    }

    axios.post(url, formData, config).then(
      (response) => {
        this.props.registerUser(response.data);
        authenticateUser(this.state.username, this.state.password).then(
          (response) => {
            this.props.authenticate(response.data.access_token);
            this.props.closeModal();
          }
        ).catch(
          //TODO: Authentication error somehow??
        );
      }
    ).catch(
      (error) => {
        console.log(error);
        console.log(error.response);
        let errorState = {
          alertClass: 'error',
          alertMessages: error.response.data.errorMessages,
          usernameStatus: error.response.data.invalidUsername ? 'error' : null,
          emailStatus: error.response.data.invalidEmail ? 'error' : null
        };
        this.setState(errorState);
        console.log(this.state);
      }
    );
  }

  setUsername(event) {
    event.preventDefault();
    this.setState({
      username: event.target.value
    });
  }

  setEmail(event) {
    event.preventDefault();
    this.setState({
      email: event.target.value
    });
  }

  setPassword(event) {
    event.preventDefault();
    this.setState({
      password: event.target.value
    });
  }

  setAboutMe(event) {
    event.preventDefault();
    this.setState({
      about_me: event.target.value
    });
  }

  selectImageFile(event) {
    event.preventDefault();
    this.setState({
      image_file: event.target.files[0]
    });
  }

  renderAlert() {
    return (
      <Alert bsStyle="danger">
        {
          this.state.alertMessages.map((item, index) => (
            <p className="list-item" key={'register-alert-' + index}>
              Error: { item }
            </p>
          ))
        }
      </Alert>
    )
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header>
          <Modal.Title>New User</Modal.Title>
          <div className={this.state.alertClass}>
            {this.renderAlert()}
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup
              validationState={this.state.usernameStatus}
              controlId="formHorizontalUsername"
            >
              <Col componentClass={ControlLabel} sm={2}>
                Username
              </Col>
              <Col sm={10}>
                <FormControl
                  onChange={this.setUsername}
                  type="text"
                  placeholder="Username"
                />
              </Col>
            </FormGroup>
            <FormGroup
              validationState={this.state.emailStatus}
              controlId="formHorizontalEmail"
            >
              <Col componentClass={ControlLabel} sm={2}>
                Email
              </Col>
              <Col sm={10}>
                <FormControl
                  onChange={this.setEmail}
                  type="email"
                  placeholder="Email"
                />
              </Col>
            </FormGroup>

            <FormGroup
              validationState={this.state.passwordStatus}
              controlId="formHorizontalPassword"
            >
              <Col componentClass={ControlLabel} sm={2}>
                Password
              </Col>
              <Col sm={10}>
                <FormControl
                  onChange={this.setPassword}
                  type="password"
                  placeholder="Password"
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="formControlsAboutMe">
              <Col componentClass={ControlLabel} sm={2}>About Me</Col>
              <Col sm={10}>
                <FormControl
                  componentClass="textarea"
                  placeholder="Brief about me for yourself..."
                  onChange={this.setAboutMe}
                />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalProfilePic">
              <Col componentClass={ControlLabel} sm={2}>
                Profile Pic
              </Col>
              <Col sm={10}>
                <FormControl
                  onChange={this.selectImageFile}
                  type="file"
                  help="Select a picture to use as your profile pic."
                  placeholder="ProfilePic"
                />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} >Close</Button>
          <Button onClick={this.registerUser} bsStyle="primary">Register</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


export default class RegisterApp extends Component {
  render() {
    return (
      <div>Register</div>
    )
  }
}

export { LoginModal, RegisterModal, authenticateUser }
