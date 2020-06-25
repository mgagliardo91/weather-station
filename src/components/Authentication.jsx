import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Spinner } from 'react-bootstrap';
import contxtSdk from '../services/contxt';

const TokenContext = React.createContext({ accessToken: undefined });

const Authentication = ({ children }) => {
  const [accessToken, setAccessToken] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!contxtSdk.auth.isAuthenticated()) {
      contxtSdk.auth.logIn();
    } else {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
    const idToken = localStorage.getItem('access_token');
    if (!idToken) {
      throw new Error('Unable to locate ID access token');
    }

      axios({
        method: 'POST',
        url: 'https://contxtauth.com/v1/token',
        headers: {
          authorization: `Bearer ${idToken}`
        },
        data: {
          audiences: ['iznTb30Sfp2Jpaf398I5DN6MyPuDCftA'],
          nonce: 'nonce'
        }
      }).then(response => setAccessToken(response.data.access_token));
    }
  }, [loggedIn]);

  if (!loggedIn || !accessToken) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="grow" className="mr-2" /> Signing In
      </Container>
    );
  }

  return (
    <TokenContext.Provider value={accessToken}>
      { children }
    </TokenContext.Provider>
  )
};

export const useAccessToken = () => useContext(TokenContext);

export default Authentication;