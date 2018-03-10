import React, { Component } from 'react';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Modal } from 'react-bootstrap';


class LoginModal extends Component {
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
                <FormControl type="text" placeholder="loginUsername" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalLoginPassword">
              <Col componentClass={ControlLabel} sm={2}>
                Password
              </Col>
              <Col sm={10}>
                <FormControl type="password" placeholder="loginPassword" />
              </Col>
            </FormGroup>
          </Form>;
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} >Close</Button>
          <Button onClick={this.props.loginUser} bsStyle="primary">Login</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


class RegisterModal extends Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header>
          <Modal.Title>New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId="formHorizontalUsername">
              <Col componentClass={ControlLabel} sm={2}>
                Username
              </Col>
              <Col sm={10}>
                <FormControl type="text" placeholder="Username" />
              </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={2}>
                Email
              </Col>
              <Col sm={10}>
                <FormControl type="email" placeholder="Email" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword">
              <Col componentClass={ControlLabel} sm={2}>
                Password
              </Col>
              <Col sm={10}>
                <FormControl type="password" placeholder="Password" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalProfilePic">
              <Col componentClass={ControlLabel} sm={2}>
                Profile Pic
              </Col>
              <Col sm={10}>
                <FormControl type="file" help="Select a picture to use as your profile pic." placeholder="ProfilePic" />
              </Col>
            </FormGroup>
          </Form>;
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} >Close</Button>
          <Button onClick={this.props.registerUser} bsStyle="primary">Register</Button>
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

export { LoginModal, RegisterModal }
