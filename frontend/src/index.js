import React from 'react';
import { restoreCSRF, csrfFetch } from './store/csrf';
import './index.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as sessionActions from './store/session';
import configureStore from './store';

const store = configureStore();



if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();
  window.sessionActions = sessionActions;
  window.csrfFetch = csrfFetch;
  window.store = store;
}

function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
