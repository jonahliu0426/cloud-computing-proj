import { Avatar, Button, Divider, Hidden, TextField, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { usePostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import { MoreIcon, CommentIcon, ShareIcon, UnlikeIcon, LikeIcon, SaveIcon, RemoveIcon } from "../../icons";
import OptionDialog from "../shared/OptionsDialog";
// import { defaultPost } from "../../data";
import PostSkeleton from "./PostSkeleton";
import { useMutation, useSubscription } from "@apollo/client";
import { GET_POST } from "../../graphql/subscriptions";
import { UserContext } from "../../App";
import { CREATE_COMMENT, LIKE_POST, SAVE_POST, UNLIKE_POST, UNSAVE_POST } from "../../graphql/mutations";
import { formatDateToNowShort, formatPostDate } from "../../utils/formatDate";

function Post({ postId }) {
  const classes = usePostStyles();
  // const [loading, setLoading] = React.useState(true);
  // const { id, media, likes, user, caption, comments } = defaultPost;
  const [showOptionDialog, setShowOptionDialog] = React.useState(false);
  const variables = { postId }
  const { data, loading } = useSubscription(GET_POST, { variables });


  // setTimeout(() => setLoading(false), 2000);

  if (loading) return <PostSkeleton />;

  if (data) {
    const { id, media, likes, likes_aggregate, saved_posts, user_id, user, caption, comments, created_at, location } = data.posts_by_pk;
    const likesCount = likes_aggregate.aggregate.count;
    return (
      <div className={classes.postContainer}>
        <article className={classes.article}>
          {/* Post Header */}
          <div className={classes.postHeader}>
            <UserCard user={user} location={location} avatarSize={32} />
            <MoreIcon
              className={classes.MoreIcon}
              onClick={() => setShowOptionDialog(true)}
            />
          </div>
          {/* Post Image */}
          <div className={classes.postImage}>
            <img src={media} alt="Post media" className={classes.image} style={{ "width": 500, "height": 500, margin: "auto" }} />
          </div>
          {/* Post Button */}
          <div className={classes.postButtonsWrapper}>
            <div className={classes.postButtons}>
              <LikeButton likes={likes} postId={id} authorId={user.id} />
              <Link to={`/p/${id}`}>
                <CommentIcon />
              </Link>
              <ShareIcon />
              <SaveButton savedPosts={saved_posts} postId={id} />
            </div>
            {/* Post Likes Count */}
            <Typography className={classes.likes} variant="subtitle2">
              <span>{likes === 1 ? "1 like" : `${likesCount} likes`}</span>
            </Typography>
            {/* Post Caption */}
            <div style={{
              overflowY: 'scroll',
              padding: '16px 12px',
              height: '100%'
            }}>
              <AuthorCaption user={user} createdAt={created_at} caption={caption} />
              {comments.map(comment => (
                <UserComment key={comment.id} comment={comment} />
              ))}
            </div>

            {/* Post Comment Area */}

            <Typography color="textSecondary" className={classes.datePosted}>
              {formatPostDate(created_at)}
            </Typography>
            <Hidden xsDown>
              <div className={classes.comment}>
                <Divider />
                <Comment postId={postId} />
              </div>
            </Hidden>
          </div>

        </article>
        {showOptionDialog && <OptionDialog postId={id} authorId={user.id} onClose={() => setShowOptionDialog(false)} />}
      </div>
    )
  }
  return <PostSkeleton />;
}

const LikeButton = ({ likes, postId, authorId }) => {
  const classes = usePostStyles();
  const { currentUserId } = React.useContext(UserContext)
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);
  const [liked, setLiked] = React.useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const [likePost] = useMutation(LIKE_POST)
  const [unlikePost] = useMutation(UNLIKE_POST)
  const variables = {
    postId,
    userId: currentUserId,
    profileId: authorId,
  }

  const handleLike = () => {
    setLiked(true);
    likePost({ variables })
  }

  const handleUnlike = () => {
    setLiked(false);
    unlikePost({ variables })
  }

  const onClick = liked ? handleUnlike : handleLike;

  return <Icon className={className} onClick={onClick} />
}

const SaveButton = ({ savedPosts, postId }) => {
  const classes = usePostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadySaved = savedPosts.some(({ user_id }) => user_id === currentUserId);
  const [saved, setSaved] = React.useState(isAlreadySaved);
  const [savePost] = useMutation(SAVE_POST)
  const [unsavePost] = useMutation(UNSAVE_POST)
  const Icon = saved ? RemoveIcon : SaveIcon;

  const variables = {
    userId: currentUserId,
    postId
  }

  const handleSave = () => {
    setSaved(true);
    savePost({ variables })
  }

  const handleRemove = () => {
    setSaved(false);
    unsavePost({ variables })
  }

  const onClick = saved ? handleRemove : handleSave;

  return <Icon className={classes.saveIcon} onClick={onClick} />
}

const Comment = ({ postId }) => {
  const classes = usePostStyles();
  const [content, setContent] = React.useState('');
  const [createComment] = useMutation(CREATE_COMMENT);
  const { currentUserId } = React.useContext(UserContext);

  function handleAddComment() {
    const variables = {
      content,
      postId,
      userId: currentUserId
    }
    createComment({ variables })
    setContent('');
  }

  return (
    <div className={classes.commentContainer}>
      <TextField
        fullWidth
        value={content}
        placeholder="Add a comment"
        multiline
        maxRows={2}
        minRows={1}
        className={classes.textField}
        onChange={event => setContent(event.target.value)}
        InputProps={{
          classes: {
            root: classes.root,
            underline: classes.underline
          }
        }}
      />
      <Button
        color="primary"
        className={classes.commentButton}
        disabled={!content.trim()}
        onClick={handleAddComment}
      >
        Post
      </Button>
    </div>)
}

function AuthorCaption({ user, caption, createdAt }) {
  const classes = usePostStyles();

  return (
    <div style={{ display: 'flex' }}>
      <Avatar
        src={user.profile_image}
        alt="User avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to={`/${user.username}`}>
          <Typography variant='subtitle2' component="span" className={classes.username}>
            {user.username}

          </Typography>
          <Typography variant='body2' component="span" className={classes.postCaption} style={{ paddingLeft: 0 }}
            dangerouslySetInnerHTML={{ __html: caption }}
          >
          </Typography>
        </Link>
        <Typography
          style={{ marginTop: 16, marginBottom: 4, display: 'inline-block' }}
          color="textSecondary"
          variant="caption"
        >
          {formatDateToNowShort(createdAt)}
        </Typography>
      </div>
    </div>
  )
}

function UserComment({ comment }) {
  const classes = usePostStyles();
  return (
    <div style={{ display: 'flex' }}>
      <Avatar
        src={comment.user.profile_image}
        alt="User avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to={`/${comment.user.username}`}>
          <Typography variant='subtitle2' component="span" className={classes.username}>
            {comment.user.username}
          </Typography>
          <Typography variant='body2' component="span" className={classes.postCaption} style={{ paddingLeft: 0 }}
          >
            {comment.content}
          </Typography>
        </Link>
        <Typography
          style={{ marginTop: 16, marginBottom: 4, display: 'inline-block' }}
          color="textSecondary"
          variant="caption"
        >
          {formatDateToNowShort(comment.created_at)}
        </Typography>
      </div>
    </div>
  )
}

export default Post;
