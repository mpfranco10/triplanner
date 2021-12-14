// src/auth/auth0-provider-with-history.js

import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = 'dev-pxvk0q3d.us.auth0.com';
  const clientId = 'F7YgSVBKnopGhKfsYchWk1tSx0gBlpZM';
  const callbackUrl = process.env.REACT_APP_CALLBACK_REDIRECT;
//process.env.REACT_APP_CALLBACK_REDIRECT
  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  //https://trip-planner-mpf.herokuapp.com/callback
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={callbackUrl}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;