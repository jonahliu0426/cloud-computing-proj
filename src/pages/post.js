import React from "react";
import Layout from "../components/shared/Layout";
import { useParams } from "react-router-dom";
import Post from "../components/post/Post";
import MorePostsFromUser from "../components/post/MorePostsFromUser";
import { Switch, Redirect } from "react-router-dom"


function PostPage() {
  const { postId } = useParams();

  if (postId === 'undefined') {
    return (
      <Switch>
        <Redirect to="/" />
      </Switch>
    )
  }
  return (
    <Layout>
      <Post postId={postId} />
      <MorePostsFromUser postId={postId} />
    </Layout>
  )
}

export default PostPage;
