import React from 'react';
import * as toastr from 'toastr';
import axios from 'axios';

import AuthContent from './auth-content';
import * as Keycloak from 'keycloak-js'

class AppContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { token: {}, tokenParsed: {}, authenticated: false, api: {} }
    this.keycloak = new Keycloak({
      url: 'http://0.0.0.0:8080/auth',
      realm: 'master',
      clientId: 'test-client',
    });

    this.login = this.login.bind(this);
    this.callApi = this.callApi.bind(this);
    this.renewToken = this.renewToken.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.keycloak.init({ checkLoginIframe: false })
      .then(authenticated => {
        if (authenticated) {
          this.setState({ token: this.keycloak.token, tokenParsed: this.keycloak.tokenParsed, authenticated: authenticated });
        }
        toastr.info(authenticated ? 'User is authenticated' : 'User is not authenticated');
      })
      .catch(error => {
        toastr.error(`User authentication failed: ${error}`)
      });
  }

  login() {
    this.keycloak.login();
  }

  callApi() {
    if (!this.state.authenticated) {
      toastr.error('User is not authenticated');
      return;
    }

    this._callApi()
      .then(response => {
        this.setState({ api: response.data });
        toastr.success('Api call succeeded.');
      })
      .catch(error => {
        if (error.response.status === 401) {
          return this.keycloak.updateToken().then(() => {
            return this._callApi()
          });
        }
        toastr.error(error);
      })
  }

  renewToken() {
    this.keycloak.updateToken()
      .then(refreshed => {
        if (refreshed) {
          toastr.success('Token refresh succeeded.');
        }
      })
      .catch(error => {
        toastr.error(`Token refresh failed: ${error}`)
      });
  }


  logout() {
    this.keycloak.logout();
  }

  _callApi() {
    return axios.create({
      baseURL: 'http://localhost:5000',
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.state.token}`
      }
    })
      .get('weatherforecast');
  }

  render() {
    return (
      <div>
        <span>
          <button onClick={this.login}>login</button>
          <button onClick={this.renewToken}>renewToken</button>
          <button onClick={this.callApi}>call api</button>
          <button onClick={this.logout}>logout</button>
        </span>
        <AuthContent token={this.state.tokenParsed} api={this.state.api} />
      </div>
    );
  }
}

export default AppContent;