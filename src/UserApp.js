import React, { Component } from 'react';
import {
  Button, ButtonGroup, Form, FormControl, FormGroup, Glyphicon, Image, Media, PageHeader, Row, Panel,
} from 'react-bootstrap';
import axios from 'axios';


export default class UserApp extends Component {
  constructor(props) {
    super(props);
    this.renderEditButton = this.renderEditButton.bind(this);
    this.renderUserName = this.renderUserName.bind(this);
    this.renderAboutMe = this.renderAboutMe.bind(this);
    this.renderUploadImageForm = this.renderUploadImageForm.bind(this);

    this.setEditState = this.setEditState.bind(this);
    this.setAboutMe = this.setAboutMe.bind(this);
    this.selectImageFile = this.selectImageFile.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.setProfile = this.setProfile.bind(this);

    this.state = {
      edit: false
    }
  }

  selectImageFile(event) {
    event.preventDefault();
    this.setState({
      image_file: event.target.files[0]
    });
  }

  renderUploadImageForm() {
    if(this.state.edit) {
      return (
        <Form>
          <FormGroup controlId="changeProfilePic">
            <FormControl
              onChange={this.selectImageFile}
              type="file"
              accept=".jpg,.jpeg,.png"
              help="Select a picture to use as your profile pic."
              placeholder="ProfilePic"
            />
          </FormGroup>
        </Form>
      )
    } else {
      return;
    }
  }

  setAboutMe(event) {
    event.preventDefault();
    this.setState({
      about_me: event.target.value
    });
  }

  renderAboutMe() {
    if(this.state.edit) {
      return (
        <Form>
          <FormGroup controlId="formControlsAboutMe">
            <FormControl
              componentClass="textarea"
              placeholder={this.state.about_me}
              onChange={this.setAboutMe}
            />
          </FormGroup>
        </Form>
      )
    } else {
      return this.state.about_me
    }
  }

  setUsername(event) {
    event.preventDefault();
    this.setState({
      username: event.target.value
    });
  }

  renderUserName() {
    if(this.state.edit) {
      return (
        <Form>
          <FormGroup controlId="editUsername" validationState={this.state.usernameStatus}>
            <FormControl
              onChange={this.setUsername}
              type="text"
              placeholder={this.state.username}
            />
          </FormGroup>
        </Form>
      )
    } else {
      return this.state.username;
    }
  }

  setProfile(event) {
    event.preventDefault();
    if(!this.state.username) {
      let statuses = {
        alertClass: 'show-alert',
        alertMessages: []
      };
      statuses['usernameStatus'] = 'error';
      statuses['alertMessages'].push('No username provided');
      this.setState(statuses);
      return;
    }

    //const url = 'http://localhost:8080/account/edit';
    const url = 'http://localhost:8080/account/edit';
    const formData = new FormData();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        //'JWT': this.props.accessToken
        'Authorization': 'JWT ' + this.props.accessToken
      }
    };

    console.log('headers', config);

    formData.append('username', this.state.username);
    formData.append('about_me', this.state.about_me);
    if(this.state.image_file) {
      formData.append('profile_pic', this.state.image_file);
    }

    axios.post(url, formData, config).then(
      (response) => {
        this.setState({
          user: response.data,
          edit: false
        });
      }
    ).catch(
      (error) => {
        alert('Critical Error!');
        console.log(error);
        if(error.response) {
          console.log(error.response);
        }
      }
    );
  }

  renderEditButton(user_id) {
    console.log('user', this.props.user);
    console.log('edit', this.state.edit);
    if (this.props.user === user_id) {
      if(this.state.edit) {
        return (
          <ButtonGroup className="user-edit-button">
            <Button onClick={this.setEditState}>Close</Button>
            <Button onClick={this.setProfile} bsStyle="primary" >Save</Button>
          </ButtonGroup>
        )
      } else {
        return (
          <Button onClick={this.setEditState} className="user-edit-button" bsSize="xsmall">
            <Glyphicon className="user-edit-button" glyph="pencil"/>
          </Button>
        );
      }
    } else {
      return;
    }
  }

  setEditState() {
    if (this.state.edit) {
      this.setState({
        edit: false
      });
    } else {
      this.setState({
        edit: true
      });
    }
  }

  getUser(user_id) {
    const url = 'http://localhost:8080/account/get/' + user_id;
    return axios.get(url);
  }

  componentWillMount() {
    this.getUser(this.props.match.params.userID).then(
      (response) => {
        this.setState({
          username: response.data.username,
          about_me: response.data.about_me,
          profile_pic_url: response.data.profile_pic
        });
      }
    );
  }

  render() {
    return (
      <div className="container">
        <PageHeader>{this.renderUserName()}</PageHeader>
        <Row>
          { this.renderEditButton(this.props.match.params.userID) }
        </Row>
        <Row>
          <Media>
            <Media.Left>
              <Image
                src={this.state.profile_pic_url}
                rounded
                height={200}
                with={200}
              />
              {
                this.renderUploadImageForm()
              }
            </Media.Left>
            <Media.Body>
              <Panel>
                <Panel.Heading>About the User</Panel.Heading>
                <Panel.Body>{this.renderAboutMe()}</Panel.Body>
              </Panel>
            </Media.Body>
          </Media>
        </Row>
      </div>
    );
  }
}