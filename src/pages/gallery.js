import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../App";
import Layout from "../components/shared/Layout";
import GalleryGrid from "../components/gallery/GalleryGrid";


function Gallery() {
    const { totalNFT, setTotalNFT } = useContext(UserContext);
    const [nftList, setNftList] = useState([]);

    useEffect(() => {

    }, [])


    return (
        <Layout>
            <GalleryGrid />
        </Layout>
    )
}

export default Gallery;