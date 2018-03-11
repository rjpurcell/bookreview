import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render((
  <BrowserRouter>
    <App cookies={new Cookies()} />
  </BrowserRouter>
), document.getElementById('root'));


registerServiceWorker();
