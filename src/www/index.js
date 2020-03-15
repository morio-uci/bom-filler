import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import getSchema from './getGraphqlSchema'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

getSchema().then((introspectionQueryResultData) => {
    const fragmentMatcher = new IntrospectionFragmentMatcher({introspectionQueryResultData})

    const cache = new InMemoryCache({ fragmentMatcher })
    // Pass your GraphQL endpoint to uri
    const client = new ApolloClient({ uri: './api/v1/graphql', cache });

    const ApolloApp = AppComponent => (
        <ApolloProvider client={client}>
            <AppComponent />
        </ApolloProvider>
    );

    ReactDOM.render(ApolloApp(App), document.getElementById('root'))

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister()

}).catch( () => {
  ReactDOM.render(<main>Sorry we had a problem connecting to backend service. Try again later.</main>,document.getElementById('root'))
})