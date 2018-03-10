import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BookApp from './BookApp.js';
import HomepageApp from './HomepageApp.js';
import NavHeader from './Navigation.js';
import RegisterApp, { RegisterModal } from './RegisterApp.js';
import UserApp from './UserApp.js';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.openRegisterModal = this.openRegisterModal.bind(this);
    this.closeRegisterModal = this.closeRegisterModal.bind(this);

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
  render() {
    return (
      <div>
        <NavHeader onClickRegister={this.openRegisterModal} />
        <RegisterModal
          show={this.state.registerModalIsOpen}
          closeModal={this.closeRegisterModal}
          registerUser={ () => {} }
        />
        <Switch>
          <Route exact path="/" component={HomepageApp}/>
          <Route path="/home" component={HomepageApp}/>
          <Route path="/book/:bookID" component={BookApp}/>
          <Route path="/profile" component={UserApp}/>
          <Route path="/user/:userID" component={UserApp}/>
          <Route path="/register" component={RegisterApp}/>
        </Switch>
      </div>
    );
  }
}


export default App;
