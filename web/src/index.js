import React from 'react';
import ReactDOM from 'react-dom';
import jwtDecode from 'jwt-decode';

import './index.css';
import App from '../src/components/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'bootstrap/dist/css/bootstrap.min.css';

import store from './store';
import setAuthToken from './setAuthToken';
import { logoutUser, setCurrentUser } from './actions/authActions';

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const token=localStorage.getItem('jwtToken');
  store.dispatch(setCurrentUser(token));

  const currentTime = Date.now() / 1000;
  if (token.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/users/login';
  }
}

ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
