import React from "react";
import { useProfileTabsStyles } from "../../styles";
import { Hidden, Tabs, Divider, Tab, Typography } from "@material-ui/core";
import { GridIcon, SaveIcon } from "../../icons";
import GridPost from "../shared/GridPost";


function ProfileTabs({ user, isOwner }) {
  const classes = useProfileTabsStyles();
  const [value, setValue] = React.useState(0)

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
      {value === 1 && <NFTPosts user={user} isOwner={isOwner} />}
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

const NFTPosts = ({ user, isOwner }) => {
  const classes = useProfileTabsStyles();

  if (user.nfts?.length === 0) {
    return (
      <section className={classes.profilePostsSection}>
        <div className={classes.noContent}>
          <div className={classes.nftCollectionIcon} />
          {isOwner ? (
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

  return (
    <>
      <section className={classes.profilePostsSection}>
        <div className={classes.noContent}>
          <div className={classes.nftCollectionIcon} />
          <Typography variant="h4">
            NFT Collection
          </Typography>
          <Typography align="center">
            Discover, collect, and sell extraordinary NFTs
          </Typography>
        </div>
      </section>
      <article className={classes.article}>
        <div className={classes.postContainer}>
          {user.nfts?.map(nft => (
            <GridNFT key={nft.id} nft={nft} />
          ))}
        </div>
      </article>
    </>
  )
}

const GridNFT = () => {
  return <>NFT Post</>
}
export default ProfileTabs;
