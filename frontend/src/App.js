import React, {Fragment, useEffect} from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { connect } from 'react-redux';

import { compose } from 'redux';

import LoginPage from "./components/login";
import ReposPage from "./components/repos";
import {ConnectedRouter as Router} from "react-router-redux";
import {history} from "./redux/store";

const App = ({auth}) => {
  const { token } = auth;

  return(
    <Router history = { history }>
      {
        token ? (
            <Switch>
              <Route exact component = { ReposPage } path = '/repos' />
              <Redirect exact push to = '/repos' />
            </Switch>
        ) : (

            <Switch>
              <Route exact component = { LoginPage } path = '/auth' />
              <Redirect exact push to = '/auth' />
            </Switch>
        )
      }
    </Router>
  )
};


const mapStateToProps = ({ auth}) => ({
  auth,
});

export default compose(
  connect(mapStateToProps)
)(App);
