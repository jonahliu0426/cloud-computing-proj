import { Typography } from "@material-ui/core";
import React from "react";
import { useGridPostStyles } from "../../styles";
import { Link, useHistory } from "react-router-dom";
import { Image } from "@material-ui/icons";

function GridNFT({ nft }) {
    const history = useHistory();

    const classes = useGridPostStyles();
    const { name, description, img_url } = nft

    const handleOpenPostModal = () => {
        history.push({
            pathname: `/p/${img_url}`,
            state: { modal: true }
        })
    }

    // console.log('post', { post })
    // const likesCount = post.likes_aggregate.aggregate.count;
    // const commentsCount = post.comments_aggregate.aggregate.count;

    return (
        <div onClick={handleOpenPostModal} className={classes.gridPostContainer}>
            <div className={classes.gridPostOverlay}>
            </div>
            <img
                src={nft?.image || nft['metadata']['image_url'] || "error"}
                alt="nft"
                className={classes.image}
            />
        </div>
    )
}

export default GridNFT;
