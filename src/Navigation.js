import React, {Component} from "react";
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default class NavHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    }
  }

  renderBookDropdown() {
    return (
      <NavDropdown title="Books" id="book-navbar-dropdown">
        <MenuItem>All Books</MenuItem>
        {
          this.state.user ? (
            <MenuItem>My Favorites</MenuItem>
          ) : null
        }
        {
          this.state.user ? (
            <MenuItem>My Reviewed</MenuItem>
          ) : null
        }
      </NavDropdown>
    )
  }

  renderFriendsDropdown() {
    if(this.state.user) {
      return (
        <NavDropdown title="Friends" id="friends-navbar-dropdown">
          <MenuItem >Coming Soon!</MenuItem>
        </NavDropdown>
      )
    }
  }

  renderAccountLinks() {
    if(this.state.user) {
      return (
        <Nav pullRight>
          <NavItem>Account</NavItem>
          <NavItem>Logout</NavItem>
        </Nav>
      )
    } else {
      return (
        <Nav pullRight>
          <NavItem onClick={this.props.onClickRegister}>Register</NavItem>
          <NavItem onClick={this.props.onClickLogin}>Login</NavItem>
        </Nav>
      )
    }
  }

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={'/home'}>BookReview</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {this.renderBookDropdown()}
            {this.renderFriendsDropdown()}
          </Nav>
          {this.renderAccountLinks()}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

