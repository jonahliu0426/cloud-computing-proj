import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";
import React from "react";
import { UserContext } from "../../App";
import { GET_NFTs } from "../../graphql/queries";
import { LoadingIcon, LoadingLargeIcon } from "../../icons";
import { useExploreGridStyles } from "../../styles";
import GridNFT from "../shared/GridNFT";
import { useHistory } from "react-router-dom";



function GalleryGrid() {
    const classes = useExploreGridStyles();
    const { totalNFT } = React.useContext(UserContext);
    const { data, loading } = useQuery(GET_NFTs);
    const history = useHistory();
    // const {result, url} = history.location.state;

    // const variables = { feedIds }
    // console.log({ variables });
    // const { data, loading, error } = useQuery(EXPLORE_POSTS, { variables });
    // const {  } = explorePosts()
    // console.log('data', data);
    // console.log('loading', loading);
    // React.useEffect(async () => {
    //     async function getItemInfo(tokenId) {
    //         var myHeaders = new Headers();
    //         myHeaders.append("Authorization", `Bearer ${token['id']}`);

    //         var requestOptions = {
    //             method: 'GET',
    //             headers: myHeaders,
    //             redirect: 'follow'
    //         };

    //         try {
    //             const response = await fetch("https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod//item/" + tokenId, requestOptions);
    //             const data = await response.json();
    //             const owner = data['owner'];
    //             const marketplace = data['marketplace'];
    //             return { owner, marketplace };
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     for (let i = 1; i <= totalNFT; i++){
    //         const { owner, marketplace } = await getItemInfo(i);
    //     }
    // }, [])

    if (loading) return <LoadingIcon />
    console.log(data);
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
                        {data.nfts.map((nft, idx) => (
                            <GridNFT key={idx} nft={nft} />
                        ))}
                    </div>
                </article>
            )}
        </>
    )
}

export default GalleryGrid;
