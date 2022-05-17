import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useGridPostStyles } from "../../styles";
import { Link, useHistory } from "react-router-dom";
import { Image, RecentActors } from "@material-ui/icons";
import Img from 'react-graceful-image';


function GridNFT({ nft }) {
    const history = useHistory();

    const classes = useGridPostStyles();
    const { user_id, metadata_url, token_id } = nft
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [imgUrl, setImgUrl] = useState();

    React.useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(metadata_url);
                const data = await response.json();
                setTitle(data['title']);
                setDescription(data['description']);
                setImgUrl(data['url']);
            } catch (error) {
                console.error(error)
            }
        }
        fetchData();
    }, [])

    const handleOpenPostModal = () => {
        history.push({
            pathname: `/nft/${token_id}`,
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
                src={imgUrl}
                alt="nft"
                className={classes.image}
            />
        </div>
    )
}

export default GridNFT;
