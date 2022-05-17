import React from "react";
import { useProfileTabsStyles } from "../../styles";
import { Hidden, Tabs, Divider, Tab, Typography } from "@material-ui/core";
import { GridIcon, SaveIcon } from "../../icons";
import GridPost from "../shared/GridPost";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import GridNFT from "../shared/GridNFT";
import { useEffect, useState, useContext } from "react";
import { useIPFS } from "../../utils/useIPFS";
import { UserContext, WalletContext } from "../../App";
// import { useNFTBalance } from "../../utils/useNFTBalance";
// Add this in your component file




function ProfileTabs({ user, isOwner, account }) {
  const Web3Api = useMoralisWeb3Api();

  // const { NFTBalance } = useNFTBalance(options, Web3Api);
  const classes = useProfileTabsStyles();
  const [value, setValue] = React.useState(0)

  // const [NFTs, setNFTs] = React.useState();
  const { NFTBalance, setNFTBalance } = useContext(UserContext);

  const { web3User } = useContext(WalletContext);
  console.log('web3user', web3User);
  const { resolveLink } = useIPFS();


  useEffect(() => {
    async function fetchData() {
      if (!web3User && isOwner) {
        if (NFTBalance.length > 0) {
          setNFTBalance([])
        }
        return null
      };
      // console.log('nft data', data);
      if (!isOwner && user.wallet_address === '') {
        if (NFTBalance.length > 0) setNFTBalance([])
        return null;
      }
      const options = {
        chain: "rinkeby",
        address: isOwner ? account : user.wallet_address
      };
      console.log('options', options);
      const data = await Web3Api.account.getNFTs(options);
      console.log(data);
      if (data?.result) {
        const NFTs = data.result;
        console.log('NFTs', NFTs);
        for (let NFT of NFTs) {
          if (NFT?.metadata) {
            NFT.metadata = JSON.parse(NFT.metadata);
            NFT.image = resolveLink(NFT.metadata?.image);
          } else if (NFT?.token_uri) {

            try {
              await fetch(`https://shielded-mountain-80433.herokuapp.com/${NFT.token_uri}`)
                .then(response => response.json())
                .then(data => {
                  NFT.image = resolveLink(data.image);
                  console.log('NFT image', NFT.image)
                });
            } catch (error) {
              // setFetchSuccess(false);
            }
          }
        }
        setNFTBalance(NFTs);
        console.log('NFT Balance', NFTBalance)
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3User]);
  // console.log('nft balance', NFTBalance);

  return (
    <>
      <section className={classes.section}>
        <Hidden xsDown>
          <Divider />
        </Hidden>
        <Hidden xsDown>
          <Tabs
            value={value}
            onChange={(_, value) => setValue(value)}
            centered
            classes={{ indicator: classes.tabsIndicator }}
          >
            <Tab
              icon={<span className={classes.postsIconLarge} />}
              label="POSTS"
              classes={{
                root: classes.root,
                labelIcon: classes.tabLabelIcon,
                wrapper: classes.tabWrapper
              }}
            />
            <Tab
              icon={<span className={classes.NFTIconLarge} />}
              label="NFT"
              classes={{
                root: classes.root,
                labelIcon: classes.tabLabelIcon,
                wrapper: classes.tabWrapper
              }}
            />
            {isOwner && (
              <Tab
                icon={<span className={classes.savedIconLarge} />}
                label="Saved"
                classes={{
                  root: classes.root,
                  labelIcon: classes.tabLabelIcon,
                  wrapper: classes.tabWrapper
                }}
              />
            )}

          </Tabs>
        </Hidden>
        <Hidden smUp>
          <Tabs
            value={value}
            onChange={(_, value) => setValue(value)}
            centered
            className={classes.tabs}
            classes={{ indicator: classes.tabsIndicator }}
          >
            <Tab
              icon={<GridIcon fill={value === 0 ? "#3897f0" : undefined} />}
              root={classes.tabRoot}
            />
            <Tab
              icon={<span className={classes.NFTIconSmall} />}
              root={classes.tabRoot}
            />
            {isOwner && (
              <Tab
                icon={<SaveIcon fill={value === 2 ? "#3897f0" : undefined} />}
                root={classes.tabRoot}
              />
            )}
          </Tabs>
        </Hidden>
        <Hidden smUp>{user.posts.length === 0 && <Divider />}</Hidden>
      </section>
      {value === 0 && <ProfilePosts user={user} isOwner={isOwner} />}
      {value === 1 && <NFTPosts account={account} user={user} isOwner={isOwner} NFTs={NFTBalance} />}
      {value === 2 && <SavedPosts user={user} isOwner={isOwner} />}
    </>
  )
}

const ProfilePosts = ({ user, isOwner }) => {
  const classes = useProfileTabsStyles();

  if (user.posts.length === 0) {
    return (
      <section className={classes.profilePostsSection}>
        <div className={classes.noContent}>
          <div className={classes.uploadPhotoIcon} />
          <Typography variant="h4">
            {isOwner ? "Upload a Photo" : "No Photo"}
          </Typography>
        </div>
      </section>
    )
  }

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {user.posts.map(post => (
          <GridPost key={post.id} post={post} />
        ))}
      </div>
    </article>
  )
}

const SavedPosts = ({ user, isOwner }) => {
  const classes = useProfileTabsStyles();

  if (user.saved_posts.length === 0) {
    return (
      <section className={classes.savedPostsSection}>
        <div className={classes.noContent}>
          <div className={classes.savePhotoIcon} />
          <Typography variant="h4">
            Save
          </Typography>
          <Typography align="center">
            Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.
          </Typography>
        </div>
      </section>
    )
  }

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {user.saved_posts.map(({ post }) => (
          <GridPost key={post.id} post={post} />
        ))}
      </div>
    </article>
  );
}

const NFTPosts = ({ user, isOwner, account, NFTs }) => {
  const classes = useProfileTabsStyles();
  console.log('wallet account', account)
  console.log('NFT', NFTs);


  if (NFTs?.length === 0) {
    return (
      <section className={classes.profilePostsSection}>
        <div className={classes.noContent}>
          <div className={classes.nftCollectionIcon} />
          {isOwner && !NFTs ? (
            <>
              <Typography variant="h4">
                NFT Collection
              </Typography>
              <Typography align="center">
                Discover, collect, and sell extraordinary NFTs
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h4">
                NFT Collection
              </Typography>
              <Typography align="center">
                No NFTs
              </Typography>
            </>

          )}
        </div>
      </section>
    )
  }
  else {
    return (
      <>
        <article className={classes.article}>
          <div className={classes.postContainer}>
            {NFTs.filter((nft, i) => (nft.hasOwnProperty('image') || (nft?.hasOwnProperty('metadata') && nft['metadata']?.hasOwnProperty('image_url') && nft['metadata']['image_url'] !== 'undefined'))).map((nft, i) => (
              <GridNFT key={i} nft={nft} />
            ))}
          </div>
        </article>
      </>
    )
  }

}

export default ProfileTabs;
