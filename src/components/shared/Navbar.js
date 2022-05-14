import { AppBar, Avatar, Fade, Grid, Hidden, Button, InputBase, Typography, CircularProgress, Zoom } from "@material-ui/core";
import React from "react";
import { useNavbarStyles, WhiteTooltip, RedTooltip } from "../../styles";
import { Link, useHistory } from 'react-router-dom';
import logo from '../../images/customized-logo.png'
import { AddIcon, ExploreActiveIcon, ExploreIcon, HomeActiveIcon, HomeIcon, LikeActiveIcon, LikeIcon, LoadingIcon } from "../../icons";
import NotificationTooltip from '../notification/NotificationTooltip';
import NotificationList from "../notification/NotificationList";
import { useNProgress } from "@tanem/react-nprogress";
import { SEARCH_USERS } from "../../graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { UserContext } from "../../App";
import AddPostDialog from "../post/AddPostDialog";
import { isAfter } from "date-fns";
import SpeechToText from "../../utils/transcribe";



function Navbar({ minimalNavbar }) {
  const classes = useNavbarStyles();
  const history = useHistory();
  const path = history.location.pathname;
  const [isLoadingPage, setLoadingPage] = React.useState(true);

  React.useEffect(() => {
    setLoadingPage(false);
  }, [path])

  return (
    <>
      <Progress isAnimating={isLoadingPage} />
      <AppBar className={classes.appBar}>
        <section className={classes.section}>
          <Logo />
          {!minimalNavbar && (
            <>
              <Search history={history} />
              <Links path={path} />
            </>
          )}
        </section>
      </AppBar>
    </>
  )
}

const Logo = () => {
  const classes = useNavbarStyles();

  return (
    <div className={classes.logoContainer}>
      <Link to="/">
        <div className={classes.logoWrapper}>
          <img src={logo} alt="Instagram logo" className={classes.logo} />
        </div>
      </Link>
    </div>
  )
}

const Search = ({ history }) => {
  const classes = useNavbarStyles();
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([])
  const [query, setQuery] = React.useState('');
  const [searchUsers, { data }] = useLazyQuery(SEARCH_USERS);
  const [audioConverting, setAudioConverting] = React.useState(false);

  const hasResults = Boolean(query) && results.length >= 0;

  React.useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    const variables = { query: `%${query}%` };
    searchUsers({ variables });
    if (data) {
      setResults(data.users);
      setLoading(false);
    }
  }, [query, data, searchUsers]);

  const handleClearInput = () => {
    setQuery('');
  }

  async function handleLabelSearch() {
    try {
      history.push(`/search/${query}`);
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Hidden xsDown>
      <WhiteTooltip
        arrow
        interactive
        TransitionComponent={Fade}
        open={hasResults}
        title={
          hasResults && (
            <Grid className={classes.resultContainer} container>
              <Grid className={classes.resultLink}
                onClick={handleLabelSearch}
              >
                <Typography variant="body1" color="textSecondary" >#Search Photos</Typography>
              </Grid>
              <Grid className={classes.resultLink}>
                <Typography variant="body1" color="textSecondary">User Results: </Typography>
              </Grid>
              {results.map(result => (
                <Grid key={result.id} item className={classes.resultLink}
                  onClick={() => {
                    history.push(`/${result.username}`);
                    handleClearInput();
                  }}
                >
                  <div className={classes.resultWrapper}>
                    <div className={classes.avatarWrapper}>
                      <Avatar src={result.profile_image} alt="user avatar" />
                    </div>
                    <div className={classes.nameWrapper}>
                      <Typography variant="body1">{result.username}</Typography>
                      <Typography variant="body2" color="textSecondary">{result.name}</Typography>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          )
        }
      >
        <InputBase
          className={classes.input}
          onChange={event => setQuery(event.target.value)}
          startAdornment={<span className={classes.searchIcon} />}
          endAdornment={
            loading ? (
              <>
                <span onClick={handleClearInput} className={classes.clearIcon} />
                <Button
                  variant="outlined"
                  style={{ border: 0, padding: "6px 12px" }}
                >
                  <LoadingIcon />
                </Button>

              </>
            ) :
              audioConverting ? (
                <Button
                  variant="outlined"
                  style={{ border: 0, padding: "6px 12px" }}
                >
                  <span onClick={handleClearInput} className={classes.clearIcon} />
                  <CircularProgress color="secondary" size="1rem" />
                </Button>
              ) : (
                <>
                  <span onClick={handleClearInput} className={classes.clearIcon} />
                  <SpeechToText setAudioConverting={setAudioConverting} setQuery={setQuery} query={query} />
                </>
              )
          }
          value={query}
          placeholder="Search"
        >
        </InputBase>
      </WhiteTooltip>
    </Hidden>
  )
}

const Links = ({ path }) => {
  const { me, currentUserId } = React.useContext(UserContext);
  const lastChecked = me.last_checked;
  const newNotifications = me.notifications.filter(({ created_at }) =>
    isAfter(new Date(created_at), new Date(lastChecked))
  );
  // 
  const notificationsToShow = me.notifications.filter(({ created_at }) =>
    isAfter(new Date(created_at), new Date(lastChecked).setTime(new Date(lastChecked).getTime() - (24 * 60 * 60 * 1000)))
  );
  // console.log(new Date(me.last_checked).setTime(new Date(me.last_checked).getTime() - (10 * 60 * 60 * 1000)))
  // console.log('new notifications', notificationsToShow);
  const hasNotifications = newNotifications.length > 0;
  const classes = useNavbarStyles();
  const [showList, setShowList] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(hasNotifications);
  const [media, setMedia] = React.useState(null);
  const [showAddPostDialog, setShowAddPostDialog] = React.useState(false);
  const inputRef = React.useRef();
  console.log(me);

  function handleToggleList() {
    setTimeout(() => {
      setShowList(!showList);
    }, 0);
  }

  React.useEffect(() => {
    const timeout = setTimeout(handleHideTooltip, 5000);
    return () => {
      clearTimeout(timeout);
    }
  }, []);

  const handleHideTooltip = () => {
    setShowTooltip(false);
  }

  function handleHideList() {
    setShowList(false);
  }

  function openFileInput() {
    inputRef.current.click();
  }

  function handleAddPost(event) {
    setMedia(event.target.files[0]);
    setShowAddPostDialog(true);
  }

  function handleClose() {
    setShowAddPostDialog(false);
  }

  return (
    <div className={classes.linksContainer}>
      {showList && <NotificationList currentUserId={currentUserId} notifications={notificationsToShow} handleHideList={handleHideList} />}
      <div className={classes.linksWrapper}>
        {showAddPostDialog && (
          <AddPostDialog media={media} handleClose={handleClose} />
        )}
        <Hidden xsDown>
          <input
            type="file"
            style={{ display: "none" }}
            ref={inputRef}
            onChange={handleAddPost}
          />
          <AddIcon onClick={openFileInput} />
        </Hidden>
        <Link to="/">
          {path === '/' ? <HomeActiveIcon /> : <HomeIcon />}
        </Link>
        <Link to="/explore">
          {path === '/explore' ? <ExploreActiveIcon /> : <ExploreIcon />}
        </Link>
        <RedTooltip
          arrow
          open={showTooltip}
          onOpen={handleHideTooltip}
          TransitionComponent={Zoom}
          title={<NotificationTooltip notifications={newNotifications} />}
        >
          <div className={hasNotifications ? classes.notifications : ""} onClick={handleToggleList}>
            {showList ? <LikeActiveIcon /> : <LikeIcon />}
          </div>
        </RedTooltip>
        <Link to={`/${me.username}`}>
          <div className={path === `/${me.username}` ?
            classes.profileActive : ""}>
          </div>
          <Avatar
            src={me.profile_image}
            className={classes.profileImage}
          />
        </Link>
        <Link to='/help'>
          <img src="https://img.icons8.com/ios-glyphs/30/000000/question-mark.png"/>
        </Link>
      </div >
    </div >
  )
}


const Progress = ({ isAnimating }) => {
  const classes = useNavbarStyles();
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating
  })

  return (
    <div className={classes.progressContainer}
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`
      }}
    >
      <div
        className={classes.progressBar}
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`
        }}
      >
        <div className={classes.progressBackground} />
      </div>
    </div>
  )
}

export default Navbar;
