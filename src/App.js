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
import { useMutation, useSubscription } from "@apollo/client";
import { ME } from "./graphql/subscriptions";
import LoadingScreen from "./components/shared/LoadingScreen";
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';
import NftDelta from "./pages/delta"
import ProfileBalancePage from "./pages/balance"
import NewTicket from "./new-ticket/NewTicket"
import { Ticket } from './new-ticket/Ticket'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import Web3 from 'web3';
import AWSHttpProvider from './awsHttpProvider';
import { useMoralis } from "react-moralis";
import { UPDATE_USER_WALLET } from "./graphql/mutations";
import CreatePage from './pages/create';
import NFTGallery from './pages/gallery';
import NftDetail from './pages/detail'


// Auth.configure(awsconfig);

export const UserContext = React.createContext();
export const WalletContext = React.createContext();

const APP_NAME = 'cloud computing proj'
const APP_LOGO_URL = 'https://example.com/logo.png'
const DEFAULT_ETH_JSONRPC_URL = 'https://mainnet.infura.io/v3/1e1d6b3ca9b84eff9fc0dbc6b70207c9'
const DEFAULT_CHAIN_ID = 1

const web3 = new Web3(new AWSHttpProvider("nd-nkgfu667argmjc77lsftrrfqk4.ethereum.managedblockchain.us-east-1.amazonaws.com"));


function useSearchQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
  const [totalNFT, setTotalNFT] = React.useState(20);
  const { authState, getUser } = React.useContext(AuthContext);
  const [updateUserWallet] = useMutation(UPDATE_USER_WALLET);
  const [NFTBalance, setNFTBalance] = useState([]);
  const isAuth = authState.status === "in";
  const userId = isAuth ? authState.user.username : null;
  const variables = { userId };
  const { data, loading } = useSubscription(ME, { variables, fetchPolicy: "no-cache" });
  const [marketAddress, setMarketAddress] = React.useState("0xd9145CCE52D386f254917e481eB44e9943F39138");
  const [contractABI, setContractABI] = React.useState(JSON.stringify([
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "createMarketItem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        }
      ],
      "name": "createMarketSale",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "sold",
          "type": "bool"
        }
      ],
      "name": "MarketItemCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "MarketItemSold",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "fetchMarketItems",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "nftContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "sold",
              "type": "bool"
            }
          ],
          "internalType": "struct marketPlaceBoilerPlate.MarketItem[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  ))

  const history = useHistory();
  const location = useLocation();
  const prevLocation = React.useRef(location);
  const modal = location.state?.modal;

  const query = useSearchQuery();

  // Moralis
  const { authenticate, logout, Moralis, web3, user } = useMoralis();


  // web3 wallet
  const [walletAddress, setWalletAddress] = useState();
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
          const address = user.get("ethAddress");
          setWalletAddress(address);
          const variables = {
            userId,
            walletAddress: address
          }
          updateUserWallet({ variables })
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
    setWalletAddress('');
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
      <UserContext.Provider value={{ totalNFT, setTotalNFT, me, currentUserId, followerIds, followingIds, feedIds, NFTBalance, setNFTBalance }}>
        <WalletContext.Provider value={{ marketAddress, setMarketAddress, contractABI, setContractABI, walletAddress, connectWallet, disconnect, chainId, network, web3User, web3 }}>
          <Switch location={isModalOpen ? prevLocation.current : location}>
            <Route exact path='/create' component={CreatePage} />
            <Route exact path='/nft' component={NFTGallery} />
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
