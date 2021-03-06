import { gql } from "apollo-boost";

export const GET_USER_ID = gql`
query getUser($userId: String) {
  users(where: {user_id: {_eq: $userId}}) {
    id
  }
}
`

export const CHECK_IF_USERNAME_TAKEN = gql`
  query checkIfUsernameTaken($username: String!) {
    users(where: { username: { _eq: $username } }) {
      username
    }
  }
`;

export const GET_USER_EMAIL = gql`
query getUserEmail($input: String!) {
  users(where: {
    _or: [{username: {_eq: $input}}, {phone_number: {_eq: $input}}]
  }) {
    email
  }
}
`

export const GET_EDIT_USER_PROFILE = gql`
query getEditUserProfile($id: uuid!) {
  users_by_pk(id: $id) {
    id
    name
    username
    website
    profile_image
    phone_number
    email
    bio
  }
}
`

export const SEARCH_USERS = gql`
query searchUsers($query: String) {
  users(where: {_or: [{username: {_ilike: $query}}, {name: {_ilike: $query}}]}) {
    id
    username
    name
    profile_image
  }
}
`

export const GET_USER_PROFILE = gql`
query getUserProfile($username: String!) {
  users(where: {username: {_eq: $username}}) {
    id
    name
    username
    website
    bio
    profile_image
    wallet_address
    posts_aggregate {
      aggregate {
        count
      }
    }
    followers_aggregate {
      aggregate {
        count
      }
    }
    following_aggregate {
      aggregate {
        count
      }
    }
    saved_posts(order_by: {created_at: desc}) {
      post {
        id
        media
        likes_aggregate {
          aggregate {
            count
          }
        }
        comments_aggregate {
          aggregate {
            count
          }
        }
      }
    }
    posts(order_by: {created_at: desc}) {
      id
      media
      likes_aggregate {
        aggregate {
          count
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
    }
  }
}
`

export const SUGGEST_USERS = gql`
query suggestUsers($limit: Int!, $followerIds: [uuid!]!, $createdAt: timestamptz!) {
  users(limit: $limit, where: {_or: [
    {id: {_in: $followerIds}}, 
    {created_at: {_gt: $createdAt}}
  ]}) {
    id
    username
    name
    profile_image
  }
}
`

// posts with the most likes and comments at the top, 
// newest to the oldest where the posts are not from users we are following
export const EXPLORE_POSTS = gql`
query explorePosts($feedIds: [uuid!]!) {
  posts(
    order_by: {
      created_at: desc, 
      likes_aggregate: {count: desc}, 
      comments_aggregate: {count: desc}
    }
    where: {user_id: {_nin: $feedIds}}
    ) {
    id
    media
    likes_aggregate {
      aggregate {
        count
      }
    }
    comments_aggregate {
      aggregate {
        count
      }
    }
  }
}
`

export const EXPLORE_MORE_POSTS = gql`
query getMorePostsFromUser($userId: uuid!, $postId: uuid!) {
  posts(
    limit: 6,
    order_by: {created_at: desc, likes_aggregate: {count: desc}, comments_aggregate: {count: desc}},
    where: {user_id: {_eq: $userId}, _not: {id: {_eq: $postId}}}
  ){
    id
    media
    likes_aggregate{
      aggregate{
        count
      }
    }
    comments_aggregate{
      aggregate{
        count
      }
    }
  }
}
`

export const GET_POST = gql`
query getPost($postId: uuid!) {
  posts_by_pk(id: $postId) {
    id
    user {
      id
      username
    }
  }
}
`

export const GET_FEED = gql`
  query getFeed($limit: Int!, $feedIds: [uuid!]!, $lastTimestamp: timestamptz) {
    posts(
      limit: $limit
      where: { user_id: { _in: $feedIds }, created_at: { _lt: $lastTimestamp } }
      order_by: { created_at: desc }
    ) {
      id
      caption
      created_at
      media
      location
      is_nft
      user {
        id
        username
        name
        profile_image
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
      likes {
        id
        user_id
      }
      saved_posts {
        id
        user_id
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      comments(order_by: { created_at: desc }, limit: 2) {
        id
        content
        created_at
        user {
          username
        }
      }
    }
  }
`;


export const SEARCH_POSTS = gql`
query searchPosts($feedURLs: [String!]!) {
  posts(
    order_by: {
      created_at: desc, 
      likes_aggregate: {count: desc}, 
      comments_aggregate: {count: desc}
    }
    where: {media: {_in: $feedURLs}}
    ) {
    id
    media
    likes_aggregate {
      aggregate {
        count
      }
    }
    comments_aggregate {
      aggregate {
        count
      }
    }
  }
}
`

export const GET_POST_NFT = gql`
query getPost($postId: uuid!) {
  posts_by_pk(id: $postId) {
    id
    caption
    created_at
    location
    media
    user {
      id
      username
      name
      profile_image
    }
    likes_aggregate {
      aggregate {
        count
      }
    }
    likes{
      id
      user_id
    }
    saved_posts {
      id
      user_id
    }
    comments_aggregate {
      aggregate {
        count
      }
    }
    comments(order_by: {created_at: asc, user: {username: asc}}) {
      id
      created_at
      content
      user {
        username
        profile_image
      }
    }
  }
}
`

export const GET_NFTs = gql`
query getNFT {
  nfts {
    user_id
    metadata_url
    token_id
    tx_hash
  }
}
`