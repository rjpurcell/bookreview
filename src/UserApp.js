import React, { Component } from 'react';
import { Button, Glyphicon, Image, Media, PageHeader, Row, Panel } from 'react-bootstrap';
import axios from 'axios';


export default class UserApp extends Component {
  constructor(props) {
    console.log('props', props);
    super(props);
    this.renderEditButton = this.renderEditButton.bind(this);

    this.state = {
      user: {}
    }
  }

  renderEditButton(user_id) {
    console.log('user prop', this.props.user);
    console.log('url param', this.props.match.params.userID);
    console.log('passed param', user_id);
    if (this.props.user === user_id) {
      return (
        <Button className="user-edit-button" bsSize="xsmall">
          <Glyphicon className="user-edit-button" glyph="pencil"/>
        </Button>
      );
    } else {
      return;
    }
  }

  getUser(user_id) {
    const url = 'http://localhost:8080/account/get/' + user_id;
    return axios.get(url);
  }

  componentWillMount() {
    console.log('User ID ', this.props.match.params.userID);
    this.getUser(this.props.match.params.userID).then(
      (response) => {
        console.log(response);
        console.log(response.data);
        this.setState(
          {
            user: {
              username: response.data.username,
              about_me: response.data.about_me,
              profile_pic_url: response.data.profile_pic
            }
          }
        )
      }
    );
  }

  render() {
    return (
      <div className="container">
        <PageHeader>{this.state.user.username}</PageHeader>
        <Row>
          { this.renderEditButton(this.props.match.params.userID) }
        </Row>
        <Row>
          <Media>
            <Media.Left>
              <Image
                src={this.state.user.profile_pic_url}
                rounded
                height={200}
                with={200}
              />
            </Media.Left>
            <Media.Body>
              <Panel>
                <Panel.Heading>About the User</Panel.Heading>
                <Panel.Body>{this.state.user.about_me}</Panel.Body>
              </Panel>
            </Media.Body>
          </Media>
        </Row>
      </div>
    );
  }
}