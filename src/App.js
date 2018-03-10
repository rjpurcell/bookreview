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

    this.openRegisterModal = this.openRegisterModal.bind(this);
    this.closeRegisterModal = this.closeRegisterModal.bind(this);

    this.openLoginModal = this.openLoginModal.bind(this);
    this.closeLoginModal = this.closeLoginModal.bind(this);

    this.state = {
      user: null,
      registerModalIsOpen: false,
      loginModalIsOpen: false
    }
  }

  openRegisterModal() {
    this.setState({registerModalIsOpen: true});
  }

  closeRegisterModal() {
    this.setState({registerModalIsOpen: false});
  }

  openLoginModal() {
    console.log('Hello?');
    this.setState({loginModalIsOpen: true});
  }

  closeLoginModal() {
    this.setState({loginModalIsOpen: false});
  }

  render() {
    return (
      <div>
        <NavHeader onClickRegister={this.openRegisterModal} onClickLogin={this.openLoginModal} />
        <RegisterModal
          show={this.state.registerModalIsOpen}
          closeModal={this.closeRegisterModal}
          registerUser={ () => {} }
        />
        <LoginModal
          show={this.state.loginModalIsOpen}
          closeModal={this.closeLoginModal}
          loginUser={ () => {} }
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
