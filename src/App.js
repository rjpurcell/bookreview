import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BookApp from './BookApp.js';
import HomepageApp from './HomepageApp.js';
import NavHeader from './Navigation.js';
import { LoginModal, RegisterModal } from './AuthenticateApp.js';
import UserApp from './UserApp.js';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.setUser = this.setUser.bind(this);
    this.setAccessToken = this.setAccessToken.bind(this);

    this.openRegisterModal = this.openRegisterModal.bind(this);
    this.closeRegisterModal = this.closeRegisterModal.bind(this);

    this.openLoginModal = this.openLoginModal.bind(this);
    this.closeLoginModal = this.closeLoginModal.bind(this);
    this.clearAuth = this.clearAuth.bind(this);

    this.state = {
      user: null,
      registerModalIsOpen: false,
      loginModalIsOpen: false,
      accessToken: null
    }
  }

  clearAuth() {
    this.setState({
      user: null,
      accessToken: null
    })
  }

  setUser(userObject) {
    this.setState({
      user: userObject
    })
  }

  setAccessToken(token) {
    this.setState({
      accessToken: token
    })
  }

  openRegisterModal() {
    this.setState({registerModalIsOpen: true});
  }

  closeRegisterModal() {
    this.setState({registerModalIsOpen: false});
  }

  openLoginModal() {
    this.setState({loginModalIsOpen: true});
  }

  closeLoginModal() {
    console.log('whats going on here');
    this.setState({loginModalIsOpen: false});
  }

  render() {
    return (
      <div>
        <NavHeader
          clearAuth={this.clearAuth}
          user={this.state.user}
          onClickRegister={this.openRegisterModal}
          onClickLogin={this.openLoginModal}
        />
        <RegisterModal
          show={this.state.registerModalIsOpen}
          closeModal={this.closeRegisterModal}
          registerUser={this.setUser}
          authenticate={this.setAccessToken}
        />
        <LoginModal
          show={this.state.loginModalIsOpen}
          closeModal={this.closeLoginModal}
          loginUser={this.setUser}
          authenticate={this.setAccessToken}
        />
        <Switch>
          <Route exact path="/" component={HomepageApp}/>
          <Route path="/home" component={HomepageApp}/>
          <Route path="/book/:bookID" component={BookApp}/>
          <Route path="/profile" component={UserApp}/>
          <Route path="/user/:userID" component={UserApp}/>
        </Switch>
      </div>
    );
  }
}


export default App;
