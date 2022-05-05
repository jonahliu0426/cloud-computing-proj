import React from "react";
import Layout from "../components/shared/Layout";
import { useProfilePageStyles } from "../styles";
// import { defaultCurrentUser } from "../data";
import { Card, CardContent, Hidden, Button, Typography, Dialog, Zoom, Divider, DialogTitle, Avatar } from "@material-ui/core";
import ProfilePicture from "../components/shared/ProfilePicture"
import { GearIcon } from "../icons";
import FollowButton from "../components/shared/FollowButton";
import { Link, useHistory, useParams } from "react-router-dom";
import ProfileTabs from "../components/profile/ProfileTabs";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { UserContext } from "../App";
import { FOLLOW_USER, UNFOLLOW_USER } from "../graphql/mutations";
import { AuthContext } from "../auth";


function ProfilePage() {
  const { username } = useParams();
  const { currentUserId } = React.useContext(UserContext);
  const classes = useProfilePageStyles();
  const [showOptionMenu, setShowOptionMenu] = React.useState(false);
  const variables = { username };
  const { data, loading } = useQuery(GET_USER_PROFILE, { variables, fetchPolicy: "no-cache" });

  if (loading) return <LoadingScreen />
  console.log('user', data.users);
  const [user] = data.users
  console.log('user', user);
  const isOwner = user.id === currentUserId;

  const handleOptionsMenuClick = () => {
    setShowOptionMenu(true);
  }

  const handleCloseMenu = () => {
    setShowOptionMenu(false);
  }

  return (
    <Layout title={`${user.name} @${user.username}`}>
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture user={user} isOwner={isOwner} image={user.profile_image} />
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection
                user={user}
                isOwner={isOwner}
                handleOptionsMenuClick={handleOptionsMenuClick}
              />
              <PostCountSection user={user} />
              <NameBioSection user={user} />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture user={user} size={77} isOwner={isOwner} image={user.profile_image} />
                <ProfileNameSection
                  user={user}
                  isOwner={isOwner}
                  handleOptionsMenuClick={handleOptionsMenuClick}
                />
              </section>
              <NameBioSection user={user} />
            </CardContent>
            <PostCountSection user={user} />
          </Card>
        </Hidden>
        {showOptionMenu && <OptionsMenu handleCloseMenu={handleCloseMenu} />}
        <ProfileTabs user={user} isOwner={isOwner} />
      </div>
    </Layout>
  )
}


const ProfileNameSection = ({ user, isOwner, handleOptionsMenuClick }) => {
  const classes = useProfilePageStyles();
  const [showUnfollowDialog, setShowUnfollowDialog] = React.useState(false);
  const { currentUserId, followingIds, followerIds } = React.useContext(UserContext);
  const isAlreadyFollowing = followingIds.some(id => id === user.id)
  const [isFollowing, setIsFollowing] = React.useState(isAlreadyFollowing);
  const isFollower = !isFollowing && followerIds.some(id => id === user.id);
  const [followUser] = useMutation(FOLLOW_USER);

  function handleFollowUser() {
    setIsFollowing(true);
    const variables = {
      userIdToFollow: user.id,
      currentUserId
    }
    followUser({ variables });
  }

  const onUnfollowUser = React.useCallback(() => {
    setShowUnfollowDialog(false);
    setIsFollowing(false);
  }, [])

  let followButton;
  // const isFollowing = true;
  // const isFollower = false;
  if (isFollowing) {
    followButton = (
      <Button onClick={() => setShowUnfollowDialog(true)} variant="outlined" className={classes.button}>
        Following
      </Button>
    )
  } else if (isFollower) {
    followButton = (
      <Button onClick={handleFollowUser} variant="contained" color="primary" className={classes.button}>
        Follow Back
      </Button>
    )
  } else {
    followButton = (
      <Button onClick={handleFollowUser} variant="contained" color="primary" className={classes.button}>
        Follow
      </Button>
    )
  }
  return (
    <>
      <Hidden xsDown>
        <section className={classes.usernameSection}>
          <Typography className={classes.username}>
            {user.username}
          </Typography>
          {isOwner ? (
            <>
              <Link to={"/accounts/edit"}>
                <Button variant="outlined">Edit Profile</Button>
              </Link>
              <div
                onClick={handleOptionsMenuClick}
                className={classes.settingsWrapper}
              >
                <GearIcon className={classes.setting} />
              </div>
            </>
          ) : (
            <>
              {followButton}
            </>
          )}
        </section>
      </Hidden>
      <Hidden smUp>
        <section>
          <div className={classes.usernameDivSmall}>
            <Typography className={classes.username}>
              {user.username}
            </Typography>
            {isOwner && (
              <div
                onClick={handleOptionsMenuClick}
                className={classes.settingsWrapper}
              >
                <GearIcon className={classes.setting} />
              </div>
            )}
          </div>
          {isOwner ? (
            <Link to={"/accounts/edit"}>
              <Button variant="outlined">Edit Profile</Button>
            </Link>
          ) : (
            <>
              <FollowButton />
            </>
          )}
        </section>
      </Hidden>
      {showUnfollowDialog && <UnfollowDialog onUnfollowUser={onUnfollowUser} user={user} onClose={() => setShowUnfollowDialog(false)} />}
    </>
  )
}

const UnfollowDialog = ({ onUnfollowUser, onClose, user }) => {
  const classes = useProfilePageStyles();
  const { currentUserId } = React.useContext(UserContext);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  function handleUnfollowUser() {
    const variables = {
      userIdToUnfollow: user.id,
      currentUserId
    }
    unfollowUser({ variables })
    onUnfollowUser();
  }


  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.unfollowDialogScrollPaper
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      <div className={classes.wrapper}>
        <Avatar
          src={user.profile_image}
          alt={`${user.username}'s avatar`}
          className={classes.avatar}
        />
      </div>
      <Typography
        align="center"
        variant="body2"
        className={classes.unfollowDialogText}
      >
        Unfollow @{user.username}?
      </Typography>
      <Divider />
      <Button onClick={handleUnfollowUser} className={classes.unfollowButton}>
        Unfollow
      </Button>
      <Divider />
      <Button onClick={onClose} className={classes.cancelButton}>
        Cancel
      </Button>
    </Dialog>
  )
}

const PostCountSection = ({ user }) => {
  const classes = useProfilePageStyles();
  const options = ["posts", "followers", "following"]

  return (
    <>
      <Hidden smUp>
        <Divider />
      </Hidden>
      <section className={classes.followingSection}>
        {options.map(option => (
          <div key={option} className={classes.followingText}>
            <Typography className={classes.followingCount}>
              {user[`${option}_aggregate`].aggregate.count}
            </Typography>
            <Hidden xsDown>
              <Typography>{option}</Typography>
            </Hidden>
            <Hidden smUp>
              <Typography color="textSecondary">{option}</Typography>
            </Hidden>
          </div>
        ))}
      </section>
      <Hidden smUp>
        <Divider />
      </Hidden>
    </>
  )
}

const NameBioSection = ({ user }) => {
  const classes = useProfilePageStyles();

  return (
    <section className={classes.section}>
      <Typography className={classes.typography}>{user.name}</Typography>
      <Typography>{user.bio}</Typography>
      <a href={user.website} target="_blank" rel="noopener noreferrer">
        <Typography color="secondary" className={classes.typography}>
          {user.website}
        </Typography>
      </a>

    </section>
  )
}

const OptionsMenu = ({ handleCloseMenu }) => {
  const classes = useProfilePageStyles();
  const { signOut } = React.useContext(AuthContext)
  const [showLogOutMessage, setShowLogOutMessage] = React.useState(false);
  const history = useHistory();
  const client = useApolloClient();

  const handleLogOutClick = () => {
    setShowLogOutMessage(true);
    setTimeout(async () => {
      await client.clearStore();
      signOut();
      history.push("/");
      // console.log('client', client);
      // window.location.reload();
    }, 2000);
  }

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.dialogScrollPaper,
        paper: classes.dialogPaper,
      }}
      TransitionComponent={Zoom}
    >
      {showLogOutMessage ? (
        <DialogTitle className={classes.dialogTitle}>
          Logging Out
          <Typography color="textSecondary">
            You need to log back in to continue using Instagram.
          </Typography>
        </DialogTitle>
      ) : (
        <>
          <OptionsItem text="Change Password" />
          <OptionsItem text="Nametag" />
          <OptionsItem text="Authorized Apps" />
          <OptionsItem text="Notification" />
          <OptionsItem text="Privacy and Security" />
          <OptionsItem text="Log Out" onClick={handleLogOutClick} />
          <OptionsItem text="Cancel" onClick={handleCloseMenu} />
        </>
      )}

    </Dialog>
  )
}

const OptionsItem = ({ text, onClick }) => {
  return (
    <>
      <Button style={{ padding: "12px 8px" }} onClick={onClick}>
        {text}
      </Button>
      <Divider />
    </>

  )
}

export default ProfilePage;
