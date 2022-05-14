import React from "react";
import { Switch, Route, Redirect, useHistory, useLocation } from "react-router-dom"
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
import createApolloClient from "./graphql/client";
import { useSubscription } from "@apollo/client";
import { ME } from "./graphql/subscriptions";
import LoadingScreen from "./components/shared/LoadingScreen";
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';
import NftDetail from "./pages/detail"
import ProfileBalancePage from "./pages/balance"

// Auth.configure(awsconfig);

export const UserContext = React.createContext();


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
        <Switch location={isModalOpen ? prevLocation.current : location}>
          <Route exact path="/" component={FeedPage} />
          <Route path="/nft/:id" component={NftDetail}/>
          <Route path="/explore" component={ExplorePage} />
          <Route path="/search/:query" component={SearchPage} />
          <Route exact path="/:username" component={ProfilePage} />
          <Route exact path="/p/:postId" component={PostPage} />
          <Route path="/accounts/edit" component={EditProfilePage} />
          <Route path="/accounts/balance" component={ProfileBalancePage} />
          <Route path="/accounts/login" component={LoginPage} />
          <Route path="/accounts/emailsignup" component={SignUpPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
        {isModalOpen && <Route exact path="/p/:postId" component={PostModal} />}
      </UserContext.Provider>
    )
  }
  return <LoadingScreen />


}

export default App;
