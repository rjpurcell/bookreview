import React, { Component } from 'react';
import { Image, Media, Pagination, Panel, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios/index";

import ReviewList from './ReviewApp.js'


class BookPreview extends Component {
  render() {
    return (
      <Row>
        <Media>
          <Media.Left>
            <Image
              src={this.props.coverArtUrl}
              rounded
              height={75}
              width={75}
            />
          </Media.Left>
          <Media.Body>
            <Panel>
              <Panel.Heading>
                <Link to={'/book/' + this.props.bookID}>
                  <Panel.Title>{this.props.title}</Panel.Title>
                  {this.props.author}
                </Link>
              </Panel.Heading>
              <Panel.Body>
                {this.props.description}
              </Panel.Body>
            </Panel>
          </Media.Body>
        </Media>
      </Row>
    )
  }
}


class BookListApp extends Component {
  constructor(props) {
    super(props);

    this.getBooks = this.getBooks.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.changePage = this.changePage.bind(this);

    this.state = {
      bookList: [],
      limit: 10,
      offset: 0,
      total: 0
    };
  }

  changePage(event) {
    event.preventDefault();
    this.getBooks(
      event.target.attributes.eventKey.value,
      this.state.limit);
  }

  renderPagination() {
    let pages = [];

    for(let i = 0; i < this.state.total; i += this.state.limit) {
      pages.push(
        <Pagination.Item
          onClick={ this.changePage }
          eventKey={i}
          active={ i === this.state.offset}>
          {parseInt(i/this.state.limit, 10) + 1}
        </Pagination.Item>
      )
    }

    if (pages.length < this.state.total) {
      return (
        <Pagination>
          {pages}
        </Pagination>
      )
    }
  }

  getBooks(offset, limit) {
    if (offset === undefined) {
      offset = this.state.offset;
    }
    if (limit === undefined) {
      limit = this.state.limit;
    }
    const url = 'http://localhost:8080/book/list';
    const params = {
      offset: offset,
      limit: limit
    };
    axios.get(url, {params: params}).then(
      (response) => {
        console.log(response.data);
        console.log(response.data.books);
        this.setState({
          bookList: response.data.books,
          limit: response.data.limit,
          offset: response.data.offset,
          total: response.data.total
        });
      }
    )
  }

  componentWillMount() {
    this.getBooks();
  }

  render() {
    console.log(this.state);
    return (
      <div className="container">
        {
          this.state.bookList.map((item) => (
            <BookPreview
              coverArtUrl={item.cover_art_url}
              description={item.description}
              bookID={item.book_id}
              key={item.book_id}
              title={item.title}
              author={item.author}
            />
            )
          )
        }
        <div>
          { this.renderPagination() }
        </div>
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
