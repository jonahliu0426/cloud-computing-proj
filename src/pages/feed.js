import React from "react";
import { useFeedPageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import { Hidden } from "@material-ui/core";
import UserCard from "../components/shared/UserCard";
//import FeedPost from "../components/feed/FeedPost";
import FeedSideSuggestions from "../components/feed/FeedSideSuggestions"
import LoadingScreen from "../components/shared/LoadingScreen";
import { LoadingLargeIcon } from "../icons";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
import { UserContext } from "../App";
import { useQuery } from "@apollo/client";
import { GET_FEED } from "../graphql/queries";
import usePageBottom from "../utils/usePageBottom";

const FeedPost = React.lazy(() => import("../components/feed/FeedPost"));

function FeedPage() {
  const classes = useFeedPageStyles();
  const [isEndOfPage, setIsEndOfPage] = React.useState(false);
  const { me, feedIds } = React.useContext(UserContext);
  const variables = {
    limit: 2,
    feedIds
  }
  const { data, loading, fetchMore } = useQuery(GET_FEED, { variables });
  const isPageBottom = usePageBottom();

  const handleUpdateQuery = React.useCallback((prev, { fetchMoreResult }) => {
    console.log({ prev, fetchMoreResult });
    if (fetchMoreResult.posts.length === 0) {
      setIsEndOfPage(true);
      return prev;
    }
    return { posts: [...prev.posts, ...fetchMoreResult.posts] };
  }, []);

  React.useEffect(() => {
    if (!isPageBottom || !data) return;
    const lastTimestamp = data.posts[data.posts.length - 1].created_at;
    const variables = { limit: 2, feedIds, lastTimestamp };
    fetchMore({
      variables,
      updateQuery: handleUpdateQuery,
    });
  }, [isPageBottom, data, fetchMore, handleUpdateQuery, feedIds]);

  // let loading = false;

  if (loading) return <LoadingScreen />
  console.log('posts data', data);
  return (
    <Layout>
      <div className={classes.container}>
        <div>
          {data.posts.map((post, index) => (
            <React.Suspense key={post.id} fallback={<FeedPostSkeleton />}>
              <FeedPost index={index} post={post} />
            </React.Suspense>
          ))}
        </div>
        <Hidden smDown>
          <div className={classes.sidebarContainer}>
            <div className={classes.sidebarWrapper}>
              <UserCard user={me} avatarSize={50} />
              <FeedSideSuggestions />
            </div>
          </div>
        </Hidden>
        {!isEndOfPage && <LoadingLargeIcon />}
      </div>
    </Layout>
  )
}

export default FeedPage;
