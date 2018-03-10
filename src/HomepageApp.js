import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';


export default class HomepageApp extends Component {
  render() {
    return (
      <div className="container">
        <Jumbotron className="homepage-container">
          <h1>Welcome to BookReview!</h1>
          <p>
            This is a simple Flask/ReactJS app I made for demo/practice purposes.
          </p>
          <p>
            It allows users to add and review books. Use the navbar at the top to get to any of the good stuff.
            Time permitting, future versions will include search functionality and allow you to friend other users and
            recommend each other books.
          </p>
        </Jumbotron>
      </div>
    )
  }
}