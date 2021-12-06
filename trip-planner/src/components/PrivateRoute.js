// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react'
import { Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';

let loading = <div className="loading">
    <div className="loader"></div>
  </div>;

const PrivateRoute = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => loading,
    })}
    {...args}
  />
);

export default PrivateRoute