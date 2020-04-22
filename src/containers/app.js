import React from 'react';
import AppContent from '../components/app-content';
import Header from '../components/header';
import logo from '../logo.svg';
import './app.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header pageTitle="Welcome to React and oidc-client-js" logoSrc={logo} />
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <AppContent />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
