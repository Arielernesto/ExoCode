import { gql } from '@apollo/client/core'
export const POSTS_QUERY = gql`
  query {
    posts {
      id
      slug
      title
      description
      image
      categories
      createdAt
      author {
        name
        avatar
      }
    }
  }
`;

export const POST_BY_SLUG_QUERY = gql`
  query Post($slug: String!) {
    post(slug: $slug) {
      id
      slug
      title
      description
      content
      image
      categories
      createdAt
      author {
        name
        avatar
      }
    }
  }
`;

export const POST_CREATE_MUTATION = gql`
  mutation CreatePost($title: String!, $description: String!, $content: String!, $image: String!, $categories: [String!]!) {
    createPost(title: $title, description: $description, content: $content, image: $image, categories: $categories) {
      id
      slug
      title
      description
      image
      categories
      createdAt
    }
  }
`;

export const POST_UPDATE_MUTATION = gql`
  mutation UpdatePost($slug: String!, $title: String, $description: String, $content: String, $image: String, $categories: [String!]) {
    updatePost(slug: $slug, title: $title, description: $description, content: $content, image: $image, categories: $categories) {
      id
      slug
      title
      description
      image
      categories
      createdAt
    }
  }
`;

export const POST_DELETE_MUTATION = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      message
      status
    }
  }
`; 