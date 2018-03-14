import React, {Component} from "react";
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default class NavHeader extends Component {

  renderBookDropdown() {
    return (
      <NavDropdown title="Books" id="book-navbar-dropdown">
        <MenuItem><Link to="/books">All Books</Link></MenuItem>
        {// TODO: Uncomment when this functionality has been added
        /*{
          this.props.user ? (
            <MenuItem>My Favorites</MenuItem>
          ) : null
        }
        {
          this.props.user ? (
            <MenuItem>My Reviewed</MenuItem>
          ) : null
        }*/}
      </NavDropdown>
    )
  }

  renderFriendsDropdown() {
    if(this.props.user) {
      return (
        <NavDropdown title="Friends" id="friends-navbar-dropdown">
          <MenuItem >Coming Soon!</MenuItem>
        </NavDropdown>
      )
    }
  }

  renderAccountLinks() {
    if(this.props.user) {
      return (
        <Nav pullRight>
          <NavItem><Link to={'/user/' + this.props.user}>Account</Link></NavItem>
          <NavItem onClick={this.props.clearAuth}>Logout</NavItem>
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

