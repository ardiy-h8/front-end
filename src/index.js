import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client-preset'
import { HttpLink } from 'apollo-client-preset';
import { InMemoryCache } from 'apollo-client-preset';

import App from './App';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3001/graphql'
  }),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
, document.getElementById('root'));
