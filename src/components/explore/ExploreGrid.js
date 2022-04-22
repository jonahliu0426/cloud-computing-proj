import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";
import React from "react";
import { UserContext } from "../../App";
import { EXPLORE_POSTS } from "../../graphql/queries";
import { LoadingLargeIcon } from "../../icons";
import { useExploreGridStyles } from "../../styles";
import GridPost from "../shared/GridPost"


function ExploreGrid() {
  const classes = useExploreGridStyles();
  // const [loading, setLoading] = React.useState(true);
  const { feedIds } = React.useContext(UserContext);
  const variables = { feedIds }
  console.log({ variables });
  const { data, loading, error } = useQuery(EXPLORE_POSTS, { variables });
  // const {  } = explorePosts()
  console.log('data', data);
  console.log('loading', loading);
  React.useEffect(() => {
    // const timeOut = setTimeout(() => setLoading(false), 1000);
    // return () => clearTimeout(timeOut);
  }, [])

  return (
    <>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        component="h2"
        gutterBottom
        className={classes.typography}
      >
        Explore
      </Typography>
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <article className={classes.article}>
          <div className={classes.postContainer}>
            {data.posts.map(post => (
              <GridPost key={post.id} post={post} />
            ))}
          </div>
        </article>
      )}
    </>
  )
}

export default ExploreGrid;
