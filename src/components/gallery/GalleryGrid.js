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
