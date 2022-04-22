import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { WebSocketLink } from "apollo-link-ws";
import { AuthContext } from "../auth";
import React from "react";

// const isIn = authState.status === "in";

// const headers = isIn ? { Authorization: `Bearer ${authState.token}`, 'x-hasura-admin-secret': 'jk27882788' } : {};

// const httpLink = new HttpLink({
//     uri: "https://your-heroku-domain/v1alpha1/graphql",
//     headers
// });


const client = new ApolloClient({
    link: new WebSocketLink({
        uri: "wss://instagram-react-webapp.herokuapp.com/v1/graphql",
        options: {
            reconnect: true,
            connectionParams: {
                headers: {
                    'x-hasura-admin-secret': 'jk27882788'
                }
            }
        }
    }),
    cache: new InMemoryCache(),
});

export default client;