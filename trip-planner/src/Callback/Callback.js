// src/Callback/Callback.js
import React from 'react';
import { withRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from "react-redux";
import { userChanged } from "../reducers/UserReducer";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

function Callback(props) {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
  } = useAuth0();

  const dispatch = useDispatch();

  axios.get('/greetings', //proxy uri
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      const resp = res.data;
      console.log(resp);
    });

  let loading = <div className="loading">
    <div className="loader"></div>
  </div>;

  if (isLoading) {
    return loading;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {

    console.log("callback called");
    dispatch(userChanged(user));
    return <Redirect push to="/plan" />
  } else {
    //reset user
    dispatch(userChanged({}));
    return <Redirect push to="/" />
  }
}

export default withRouter(Callback);