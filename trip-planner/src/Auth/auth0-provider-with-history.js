// src/auth/auth0-provider-with-history.js

import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = 'dev-pxvk0q3d.us.auth0.com';
  const clientId = 'F7YgSVBKnopGhKfsYchWk1tSx0gBlpZM';

  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={'https://trip-planner-mpf.herokuapp.com/callback'}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;