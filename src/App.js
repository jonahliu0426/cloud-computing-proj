import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory, useLocation, useParams } from "react-router-dom"
import FeedPage from "./pages/feed"
import ExplorePage from "./pages/explore"
import SearchPage from "./pages/search"
import ProfilePage from "./pages/profile"
import PostPage from "./pages/post"
import EditProfilePage from "./pages/edit-profile";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import NotFoundPage from "./pages/not-found";
import PostModal from "./components/post/PostModal";
import { AuthContext } from "./auth";
import { useSubscription } from "@apollo/client";
import { ME } from "./graphql/subscriptions";
import LoadingScreen from "./components/shared/LoadingScreen";
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';
import NftDetail from "./pages/detail"
import ProfileBalancePage from "./pages/balance"
import NewTicket from "./new-ticket/NewTicket"
import {Ticket} from './new-ticket/Ticket'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import Web3 from 'web3'
import { useMoralis } from "react-moralis";



// Auth.configure(awsconfig);

export const UserContext = React.createContext();
export const WalletContext = React.createContext();

const APP_NAME = 'cloud computing proj'
const APP_LOGO_URL = 'https://example.com/logo.png'
const DEFAULT_ETH_JSONRPC_URL = 'https://mainnet.infura.io/v3/1e1d6b3ca9b84eff9fc0dbc6b70207c9'
const DEFAULT_CHAIN_ID = 1

export const coinbaseWallet = new CoinbaseWalletSDK({
  appName: APP_NAME,
  appLogoUrl: APP_LOGO_URL,
  darkMode: false
})

export const ethereum = coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID)

export const web3 = new Web3(ethereum)

function useSearchQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
  const { authState, getUser } = React.useContext(AuthContext);
  const isAuth = authState.status === "in";
  const userId = isAuth ? authState.user.username : null;
  console.log('userId', userId);
  const variables = { userId };
  console.log('variables', variables);
  const { data, loading } = useSubscription(ME, { variables, fetchPolicy: "no-cache" });

  const history = useHistory();
  const location = useLocation();
  const prevLocation = React.useRef(location);
  const modal = location.state?.modal;

  const query = useSearchQuery();

  // Moralis
  const { authenticate, logout } = useMoralis();


  // web3 wallet
  const [account, setAccount] = useState();
  const [web3User, setWeb3User] = useState();
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();

  const connectWallet = async () => {
    try {
      await authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("logged in user:", user);
          setWeb3User(user)
          const account = user.get("ethAddress");
          if (account) setAccount(account);
        })
        .catch(function (error) {
          setError(error);
        });
    } catch (error) {
      setError(error);
    }
  };

  const disconnect = async () => {
    await logout();
    console.log("logged out");
    setAccount('');
    setWeb3User();
  };


  console.log('auth', authState)


  React.useEffect(() => {
    if (history.action !== 'POP' && !modal) {
      prevLocation.current = location;
    }
  }, [location, modal, history.action]);

  React.useEffect(() => {
    getUser();
  }, [])


  if (loading) return <LoadingScreen />
  console.log('after loading', isAuth);
  if (!isAuth) {
    return (
      <Switch>
        <Route path="/accounts/login" component={LoginPage} />
        <Route path="/accounts/emailsignup" component={SignUpPage} />
        <Redirect to="/accounts/login" />
      </Switch>
    );
  }

  if (data) {
    console.log('data, ', data);
    const isModalOpen = modal && prevLocation.current !== location;
    const me = isAuth && data ? data.users[0] : null;
    const currentUserId = me.id;
    const followingIds = me.following.map(({ user }) => user.id)
    const followerIds = me.followers.map(({ user }) => user.id);
    const feedIds = [...followingIds, currentUserId];



    return (
      <UserContext.Provider value={{ me, currentUserId, followerIds, followingIds, feedIds }}>
        <WalletContext.Provider value={{ account, connectWallet, disconnect, chainId, network, web3User }}>
          <Switch location={isModalOpen ? prevLocation.current : location}>
            <Route exact path="/" component={FeedPage} />
            <Route path="/nft/:id" component={NftDetail} />
            <Route path="/explore" component={ExplorePage} />
            <Route path="/search" component={SearchPage} />
            <Route exact path="/help" component={NewTicket} />
            <Route exact path="/:username" component={ProfilePage} />
            <Route exact path="/p/:postId" component={PostPage} />
            <Route path="/accounts/edit" component={EditProfilePage} />
            <Route path="/accounts/balance" component={ProfileBalancePage} />
            <Route path="/accounts/login" component={LoginPage} />
            <Route path="/accounts/emailsignup" component={SignUpPage} />
            <Route path="/select/:tid" component={Ticket} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
          {isModalOpen && <Route exact path="/p/:postId" component={PostModal} />}
        </WalletContext.Provider>
      </UserContext.Provider>
    )
  }
  return <LoadingScreen />


}

export default App;
