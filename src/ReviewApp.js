import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, Pagination, Panel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios/index";


class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      about_me: null,
      profile_pic_url: null
    }
  }

  getUser(user_id) {
    const url = 'http://localhost:8080/account/get/' + user_id;
    return axios.get(url);
  }

  componentWillMount() {
    this.getUser(this.props.userID).then(
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
      <Panel>
        <Panel.Heading>
          <Link to={'/user/' + this.props.userID}>
            { this.state.username }
          </Link>
        </Panel.Heading>
        <Panel.Body>
          { this.props.reviewText }
        </Panel.Body>
      </Panel>
    )
  }
}


class NewReview extends Component {
  render() {
    return (
      <Panel>
        <Panel.Heading>
          New Review
        </Panel.Heading>
        <Panel.Body>
          <Form>
            <FormGroup>
              <FormControl
                onChange={this.props.setReviewText}
                type="textarea"
                placeholder="Enter your review here"
              />
            </FormGroup>
          </Form>
        </Panel.Body>
        <Panel.Footer>
          <Button onClick={this.props.saveReview} bsStyle="primary" >
            Save
          </Button>
        </Panel.Footer>
      </Panel>
    )
  }
}


export default class ReviewList extends Component {
  constructor(props) {
    super(props);

    this.getReviews = this.getReviews.bind(this);
    this.saveReview = this.saveReview.bind(this);
    this.setReviewText = this.setReviewText.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.changePage = this.changePage.bind(this);

    this.state = {
      reviews: [],
      limit: 5,
      offset: 0,
      reviewText: null,
      total: 0
    };
  }

  changePage(event) {
    event.preventDefault();
    this.getReviews(
      this.props.bookID,
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

  setReviewText(event) {
    event.preventDefault();
    this.setState({
      reviewText: event.target.value
    })
  }

  saveReview(event) {
    event.preventDefault();

    const url = 'http://localhost:8080/review/add';
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.props.accessToken
      }
    };
    const payload = {
      book_id: this.props.bookID,
      review_text: this.state.reviewText
    };

    axios.post(url, payload, config).then(
      (response) => {
        this.getReviews(this.props.bookID, 0, 5);
      }
    )
  }

  getReviews(bookID, offset, limit) {
    if (offset === undefined ) {
      offset = this.state.offset;
    }
    if (limit === undefined ) {
      limit = this.state.limit
    }
    const url = 'http://localhost:8080/review/list/' + bookID;
    const params = {
      offset: offset,
      limit: limit
    };
    axios.get(url, {params: params}).then(
      (response) => {
        this.setState({
          reviews: response.data.reviews,
          limit: response.data.limit,
          offset: response.data.offset,
          total: response.data.total
        });
      }
    );
  }

  componentWillMount() {
    this.getReviews(this.props.bookID);
  }

  render() {
    return (
      <div className="container">
        <NewReview
          setReviewText={this.setReviewText}
          saveReview={this.saveReview}
        />
        {
          this.state.reviews.map((item) => (
              <Review
                userID={item.user_id}
                reviewText={item.review_text}
                key={item.review_id}
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