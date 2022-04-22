import { Button, Dialog, Divider } from "@material-ui/core";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useOptionsDialogStyles } from "../../styles";
import { UserContext } from "../../App";
import AuthProvider from "../../auth";
import { DELETE_POST, UNFOLLOW_USER } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";

function OptionsDialog({ onClose, authorId, postId }) {
  const classes = useOptionsDialogStyles();
  const { currentUserId, followingIds } = React.useContext(UserContext);
  const isOwner = currentUserId === authorId;
  const buttonText = isOwner ? "Delete" : "Unfollow";
  const onClick = isOwner ? handleDeletePost : handleUnfollowUser;
  const isFollowing = followingIds.some(id => id === authorId);
  const isUnrelatedUser = !isOwner && !isFollowing;
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [deletePost] = useMutation(DELETE_POST);
  const history = useHistory();


  async function handleDeletePost() {
    const variables = {
      postId,
      userId: currentUserId
    }
    await deletePost({ variables });
    onClose();
    // setTimeout(() => history.push('/'), 0);
    history.push('/');
    window.location.reload();
  }

  function handleUnfollowUser() {
    const variables = {
      userIdToUnfollow: authorId,
      currentUserId
    }
    unfollowUser({ variables });
    onClose();
  }

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.dialogScrollPaper
      }}
      onClose={onClose}
    >
      {!isUnrelatedUser && <Button onClick={onClick} className={classes.redButton}>
        {buttonText}
      </Button>}
      <Divider />
      <Button className={classes.button}>
        <Link to={`/p/${postId}`}>Go to post</Link>
      </Button>
      <Divider />
      <Button className={classes.button}>
        Share
      </Button>
      <Divider />
      <Button className={classes.button}>
        Copy Link
      </Button>
      <Divider />
      <Button className={classes.button} onClick={onClose} >
        Cancel
      </Button>
    </Dialog >
  )
}

export default OptionsDialog;
