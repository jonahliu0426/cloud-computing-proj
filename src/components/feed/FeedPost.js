import { Button, Divider, Hidden, TextField, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { useFeedPostStyles } from "../../styles";
import UserCard from "../shared/UserCard";
import { MoreIcon, CommentIcon, ShareIcon, UnlikeIcon, LikeIcon, SaveIcon, RemoveIcon } from "../../icons";
import HTMLEllipsis from "react-lines-ellipsis/lib/html";
import FollowSuggestions from "../shared/FollowSuggestions";
import OptionDialog from "../shared/OptionsDialog";
import { formatDateToNow } from "../../utils/formatDate";
import Img from 'react-graceful-image';
import { SAVE_POST, UNSAVE_POST, LIKE_POST, UNLIKE_POST, CREATE_COMMENT } from '../../graphql/mutations'
import { GET_FEED } from '../../graphql/queries';
import { useMutation } from "@apollo/client";
import { UserContext } from "../../App";




function FeedPost({ post, index }) {
  const classes = useFeedPostStyles();
  const [showCaption, setShowCaption] = React.useState(false);
  const { id, media, likes, user, caption, created_at, comments, likes_aggregate, saved_posts, location, comments_aggregate } = post;
  const showFollowingSuggestions = index === 1;
  const [showOptionDialog, setShowOptionDialog] = React.useState(false);
  const likesCount = likes_aggregate.aggregate.count;
  const commentsCount = comments_aggregate.aggregate.count;

  return (
    <>
      <article className={classes.article}>
        {/* Feed Post Header */}
        <div className={classes.postHeader}>
          <UserCard user={user} location={location} />
          <MoreIcon
            className={classes.MoreIcon}
            onClick={() => setShowOptionDialog(true)}
          />
        </div>
        {/* Feed Post Image */}
        <div>
          <Img src={media} alt="Post media" className={classes.image} />
        </div>
        {/* Feed Post Button */}
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
            <span>{likesCount === 1 ? "1 like" : `${likesCount} likes`}</span>
          </Typography>
          {/* Post Caption with Expand and Collapse option */}
          <div className={showCaption ? classes.expanded : classes.collapsed}>
            <Link to={`/${user.username}`}>
              <Typography variant="subtitle2" component="span" className={classes.username}>
                {user.username}
              </Typography>
            </Link>
            {showCaption ? (
              <>
                <Typography
                  variant="body2"
                  component="span"
                  dangerouslySetInnerHTML={{ __html: caption }}
                />
                <Button
                  className={classes.moreButton}
                  onClick={() => setShowCaption(false)}
                >
                  less
                </Button>
              </>
            ) : (
              <div className={classes.captionWrapper}>
                <HTMLEllipsis
                  unsafeHTML={caption}
                  className={classes.caption}
                  maxLine="0"
                  ellipsis="..."
                  basedOn="letters"
                />
                <Button
                  className={classes.moreButton}
                  onClick={() => setShowCaption(true)}
                >
                  more
                </Button>
              </div>
            )}
          </div>
          {/* Post Comment Area */}
          <Link to={`/p/${id}`}>
            <Typography
              className={classes.comentsLink}
              variant="body2"
              component="div"
            >
              View all {commentsCount} comments
            </Typography>
          </Link>
          {comments.map(comment => (
            <div key={comment.id}>
              <Link to={`/${comment.user.username}`}>
                <Typography
                  variant="subtitle2"
                  component="span"
                  className={classes.commentUsername}
                >
                  {comment.user.username}
                </Typography>{" "}
                <Typography
                  variant="body2"
                  component="span"
                >
                  {comment.content}
                </Typography>
              </Link>
            </div>
          ))}
          <Typography color="textSecondary" className={classes.datePosted}>
            {formatDateToNow(created_at)}
          </Typography>
        </div>
        <Hidden xsDown>
          <Divider />
          <Comment postId={post.id} />
        </Hidden>
      </article>
      {showFollowingSuggestions && <FollowSuggestions />}
      {showOptionDialog && <OptionDialog authorId={user.id} postId={id} onClose={() => setShowOptionDialog(false)} />}
    </>
  )
}

const LikeButton = ({ likes, postId, authorId }) => {
  const classes = useFeedPostStyles();
  const { currentUserId, feedIds } = React.useContext(UserContext);
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);

  const [liked, setLiked] = React.useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const [likePost] = useMutation(LIKE_POST)
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = {
    postId,
    userId: currentUserId,
    profileId: authorId
  }

  function handleUpdate(cache, result) {
    const variables = { limit: 2, feedIds };
    const data = cache.readQuery({
      query: GET_FEED,
      variables
    })
    // console.log({ result, data });
    const typename = result.data.insert_likes?.__typename;
    const count = typename === 'likes_mutation_response' ? 1 : -1;
    const posts = data.posts.map(post => {
      const newPost = {
        ...post,
        likes_aggregate: {
          ...post.likes_aggregate,
          aggregate: {
            ...post.likes_aggregate.aggregate,
            count: post.likes_aggregate.aggregate.count + count
          }
        }
      }
      return post.id === postId ? newPost : post
    });
    cache.writeQuery({ query: GET_FEED, data: { posts } })
  }

  const handleLike = () => {
    setLiked(true)
    likePost({ variables, update: handleUpdate })
  }

  const handleUnlike = () => {
    setLiked(false);
    unlikePost({ variables, update: handleUpdate })
  }

  const onClick = liked ? handleUnlike : handleLike;


  return <Icon className={className} onClick={onClick} />
}

const SaveButton = ({ postId, savedPosts }) => {
  const classes = useFeedPostStyles();
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadySaved = savedPosts.some(({ user_id }) => user_id === currentUserId);
  const [saved, setSaved] = React.useState(isAlreadySaved);
  const Icon = saved ? RemoveIcon : SaveIcon;

  const [savePost] = useMutation(SAVE_POST);
  const [removePost] = useMutation(UNSAVE_POST);

  const variables = {
    postId,
    userId: currentUserId
  }
  const handleSave = () => {
    setSaved(true)
    savePost({ variables })
  }

  const handleRemove = () => {
    setSaved(false);
    removePost({ variables })
  }

  const onClick = saved ? handleRemove : handleSave;

  return <Icon className={classes.saveIcon} onClick={onClick} />
}

const Comment = ({ postId }) => {
  const { currentUserId, feedIds } = React.useContext(UserContext);
  const classes = useFeedPostStyles();
  const [content, setContent] = React.useState('');
  const [createComment] = useMutation(CREATE_COMMENT);

  function handleUpdate(cache, result) {
    const variables = { limit: 2, feedIds }
    const data = cache.readQuery({
      query: GET_FEED,
      variables
    })
    // console.log({ result, data });
    const oldComment = result.data.insert_comments.returning[0];
    const newComment = {
      ...oldComment,
      user: { ...oldComment.user }
    }
    const posts = data.posts.map(post => {
      const newPost = {
        ...post,
        comments: [...post.comments, newComment],
        comments_aggregate: {
          ...post.comments_aggregate,
          aggregate: {
            ...post.comments_aggregate.aggregate,
            count: post.comments_aggregate.aggregate.count + 1
          }
        }
      };
      return post.id === postId ? newPost : post;
    })
    cache.writeQuery({ query: GET_FEED, data: { posts } })
    setContent('');
  }

  function handleAddComment() {
    const variables = {
      content,
      postId,
      userId: currentUserId
    }
    createComment({ variables, update: handleUpdate })
  }

  return (
    <div className={classes.commentContainer}>
      <TextField
        fullWidth
        value={content}
        placeholder="Add a comment"
        multiline
        rowsMax={2}
        rows={1}
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

export default FeedPost;
