import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { MuiThemeProvider, CssBaseline, Typography } from "@material-ui/core";
import theme from "./theme";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client";
import AuthProvider from "./auth";
import Amplify, { Auth, API } from 'aws-amplify';
import awsmobile from './aws-exports';
import { MoralisProvider } from "react-moralis";


// window.LOG_LEVEL = 'DEBUG';
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

export const UserContext = React.createContext();

Auth.configure(awsmobile);

console.log('updated config', awsmobile);

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Typography component="h1" variant="h6" align="center">
          Oops! Something went wrong.
        </Typography>
      )
    }
    return this.props.children;
  }
}




// ReactDOM.render(
//   // <ErrorBoundary>
//   <ApolloProvider client={client}>
//     <AuthProvider>
//       <MuiThemeProvider theme={theme}>
//         <CssBaseline />
//         <Router>
//           <App />
//         </Router>
//       </MuiThemeProvider>
//     </AuthProvider>
//   </ApolloProvider>,
//   // </ErrorBoundary>,
//   document.getElementById('root')
// )

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <ErrorBoundary>
    <ApolloProvider client={client}>
      <AuthProvider>
        <MoralisProvider serverUrl="https://r4umfs4xjt7v.usemoralis.com:2053/server" appId="RPtsniAdE4ITyRRzoaUDVB0BoAMtMCSBPCgZwB5f">
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <App />
            </Router>
          </MuiThemeProvider>
        </MoralisProvider>
      </AuthProvider>
    </ApolloProvider>
  </ErrorBoundary>
);
