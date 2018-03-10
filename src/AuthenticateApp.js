import React, { Component } from 'react';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Modal } from 'react-bootstrap';
import axios from 'axios';


function authenticateUser(username, password) {
  console.log('username', username);
  console.log('password', password);
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

    this.fieldStatus = this.fieldStatus.bind(this);

    this.loginUser = this.loginUser.bind(this);

    this.state = {
      username: null,
      password: null,
      submit: false
      //Might want to put the fieldStatus method into state to detect changes?
    }
  }

  fieldStatus(fieldName) {
    if(!this.state.submit || this.state[fieldName]) {
      return null;
    }
    return 'error';
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
    this.setState({submit: true});
    console.log('1 username', this.state.username);
    console.log('1 password', this.state.password);
    if(
      this.fieldStatus('username') === 'error' ||
      this.fieldStatus('password') === 'error') {
      return;
    }
    authenticateUser(this.state.username, this.state.password).then(
      (response) => {
        this.props.authenticate(response.data.access_token);
        this.props.closeModal();
      }
    )
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId="formHorizontalLoginUsername">
              <Col componentClass={ControlLabel} sm={2}>
                Username
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.setUsername} type="text" placeholder="loginUsername" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalLoginPassword">
              <Col componentClass={ControlLabel} sm={2}>
                Password
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.setPassword} type="password" placeholder="loginPassword" />
              </Col>
            </FormGroup>
          </Form>;
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

    this.fieldStatus = this.fieldStatus.bind(this);

    this.state = {
      username: null,
      email: null,
      password: null,
      about_me: null,
      image_file: null,
      submit: false
      //Might want to put the fieldStatus method into state to detect changes?
    }
  }

  fieldStatus(fieldName) {
    if(!this.state.submit || this.state[fieldName]) {
      return null;
    }
    return 'error';
  }

  registerUser(event) {
    event.preventDefault();
    console.log('ohey');
    this.setState({submit: true});
    if(
      this.fieldStatus('email') === 'error' ||
      this.fieldStatus('username') === 'error' ||
      this.fieldStatus('password') === 'error') {
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
        //TODO: Error handling
        this.props.registerUser(response.data);
        authenticateUser(this.state.username, this.state.password).then(
          (response) => {
            this.props.authenticate(response.data.access_token);
            this.props.closeModal();
          }
        );
      }
    )
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

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header>
          <Modal.Title>New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup validationState={this.fieldStatus('username')} controlId="formHorizontalUsername">
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
            <FormGroup validationState={this.fieldStatus('email')} controlId="formHorizontalEmail">
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

            <FormGroup validationState={this.fieldStatus('password')} controlId="formHorizontalPassword">
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
          </Form>;
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
