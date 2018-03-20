import React, { Component } from 'react';
import { Image, ListGroup, ListGroupItem, Media, Panel, Row } from 'react-bootstrap';
import axios from "axios/index";

import ReviewList from './ReviewApp.js'


class BookListApp extends Component {
  render() {
    return (
      <div>
        {
          this.state.bookList.map((item) => (
            <div className="container">

            </div>
            )
          )
        }
      </div>
    )
  }
}

export default class BookApp extends Component {
  constructor(props) {
    super(props);
    this.renderReviews = this.renderReviews.bind(this);
    this.state = {}
  }

  renderReviews() {
    return (
      <ReviewList accessToken={this.props.accessToken} bookID={this.props.match.params.bookID}/>
    )
  }

  getBook(book_id) {
    const url = 'http://localhost:8080/book/get/' + book_id;
    return axios.get(url);
  }

  componentWillMount() {
    this.getBook(this.props.match.params.bookID).then(
      (response) => {
        console.log(response);
        console.log(response.data);
        this.setState({
          cover_art_url: response.data.cover_art_url,
          title: response.data.title,
          description: response.data.description,
          isbn: response.data.isbn
        });
      }
    );
  }

  render() {
    return (
      <div className="container">
        <Row>
          <Media>
            <Media.Left>
              <Image
                src={this.state.cover_art_url}
                rounded
                height={400}
                width={400}
              />
            </Media.Left>
            <Media.Body>
              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h3">{ this.state.title }</Panel.Title>
                </Panel.Heading>
                <Panel.Body> { this.state.author } </Panel.Body>
                <Panel.Body>
                  { this.state.description }
                </Panel.Body>
                <Panel.Footer> { this.state.isbn } </Panel.Footer>
              </Panel>
            </Media.Body>
          </Media>
        </Row>
        <Row>
          { this.renderReviews() }
        </Row>
      </div>
    )
  }
}

export { BookListApp }
