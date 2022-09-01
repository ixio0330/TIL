import styled from 'styled-components';
import PostItem from "./PostItem";

const PostListTemplate = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export default function PostList({ posts }) {
  return (
    <PostListTemplate>
      {
        posts.map((post) => <PostItem key={post.id} {...post} />)
      }
    </PostListTemplate>
  )
}