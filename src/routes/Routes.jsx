import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import contxtService from '../services/contxt';
import Dashboard from '../views/Dashboard';
import Authentication from '../components/Authentication';

const HandleCallback = () => {
  const location = useLocation();

  useEffect(() => {
    if (/access_token|id_token|error/.test(location.hash)) {
      contxtService.auth.handleAuthentication(location.hash);
    }
  }, [location]);

  return (
    <Container className="text-center my-5">
      <Spinner animation="grow" className="mr-2" /> Signing In
    </Container>
  );
};

const Logout = () => {
  useEffect(() => {
    contxtService.auth.logOut();
  }, []);

  return (
    <Container className="text-center my-5">
      <Spinner animation="grow" className="mr-2" /> Logging Out
    </Container>
  )
};

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/callback">
          <HandleCallback />
        </Route>
        <Authentication>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
        </Authentication>
      </Switch>
    </Router>
  )
};

export default Routes;
