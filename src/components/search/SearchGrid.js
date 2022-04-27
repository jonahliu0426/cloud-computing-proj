import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";
import React from "react";
import { UserContext } from "../../App";
import { SEARCH_POSTS } from "../../graphql/queries";
import { LoadingLargeIcon } from "../../icons";
import { useExploreGridStyles } from "../../styles";
import GridPost from "../shared/GridPost"
import { useParams } from "react-router-dom";


function SearchGrid({ feedURLs }) {
    const classes = useExploreGridStyles();
    // const [loading, setLoading] = React.useState(true);
    console.log(feedURLs);
    // const { query } = useParams();
    // console.log(query);
    // const { feedIds } = React.useContext(UserContext);
    const variables = { feedURLs }

    // console.log({ variables });
    const { data, loading, error } = useQuery(SEARCH_POSTS, { variables });
    // const {  } = explorePosts()
    // console.log('data', data);
    // console.log('loading', loading);


    return (
        <>
            <Typography
                color="textSecondary"
                variant="subtitle2"
                component="h2"
                gutterBottom
                className={classes.typography}
            >
                Search Results
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

export default SearchGrid;
