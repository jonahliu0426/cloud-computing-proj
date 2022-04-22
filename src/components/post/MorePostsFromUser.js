import { useQuery, useLazyQuery } from "@apollo/client";
import { Link, Typography } from "@material-ui/core";
import React from "react";
import { EXPLORE_MORE_POSTS, GET_POST } from "../../graphql/queries";
import { LoadingLargeIcon } from "../../icons";
import { useMorePostsFromUserStyles } from "../../styles";
import GridPost from "../shared/GridPost"

function MorePostsFromUser({ postId }) {
  const classes = useMorePostsFromUserStyles();
  const variables = { postId };
  const { data, loading } = useQuery(GET_POST, { variables });
  const [getMorePostsFromUser, { data: morePostsData, loading: morePostsLoading }] = useLazyQuery(EXPLORE_MORE_POSTS)

  React.useEffect(() => {
    if (loading) return;
    const userId = data.posts_by_pk.user.id;
    const postId = data.posts_by_pk.id;
    const variables = { userId, postId };
    getMorePostsFromUser({ variables });
  }, [data, loading, getMorePostsFromUser]);

  return (
    <div className={classes.container}>
      {loading || morePostsLoading ? (
        <LoadingLargeIcon />
      ) : (
        <>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            component="h2"
            gutterBottom
            className={classes.typography}
          >
            More Posts from{" "}
            <Link to={`/${data.posts_by_pk.user.username}`} className={classes.link}>
              @{data.posts_by_pk.user.username}
            </Link>
          </Typography>

          <article className={classes.article}>
            <div className={classes.postContainer}>
              {morePostsData?.posts.map(post => (
                <GridPost key={post.id} post={post} />
              ))}
            </div>
          </article>
        </>
      )}
    </div>
  )
}

export default MorePostsFromUser;
