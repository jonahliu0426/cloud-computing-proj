import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

// const isIn = authState.status === "in";

// const headers = isIn ? { Authorization: `Bearer ${authState.token}`, 'x-hasura-admin-secret': 'jk27882788' } : {};

// const httpLink = new HttpLink({
//     uri: "https://your-heroku-domain/v1alpha1/graphql",
//     headers
// });

const link = new GraphQLWsLink(
    createClient({
        url: "wss://cloud-computing-proj.hasura.app/v1/graphql",
        connectionParams: {
            headers: {
                'x-hasura-admin-secret': 'eCMJzr1EWEM3aJRhlP4234nQaqHJ5UtDWeBVZNSLIT8Spq3vMtVB9ygY8PeROIGz'
            }
        }
    }),
);

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
});

export default client;