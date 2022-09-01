import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import { useContext } from 'react';
import { PostStore } from '../PostView';

const PostItemTemplate = styled.li`
  border: 1px solid #ddd;
  padding: 10px 15px;
  margin: 10px 0;
`;

function maxLength50(string) {
  return string.length > 50 ? string.slice(0, 50) + '...' : string;
}

export default function PostItem({ id, user_id, title, content }) {
  const { fetchAllPosts, deletePost } = useContext(PostStore);

  const onDelete = async (id) => {
    await deletePost(id);
    await fetchAllPosts();
  };

  return (
    <PostItemTemplate>
      <Link to={`/post/${id}`}>
        <p>ID {id}</p>
        <p>{title}</p>
        <p>{maxLength50(content)}</p>
      </Link>
      <button onClick={() => onDelete(id)}><AiOutlineDelete /></button>
    </PostItemTemplate>
  )
}