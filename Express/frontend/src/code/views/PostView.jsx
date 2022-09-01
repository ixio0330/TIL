import { useEffect, useState, createContext } from "react";
import { Link } from 'react-router-dom';
import postApi from "../api/post";
import PostList from "./post/PostList";

export const PostStore = createContext(null);

export default function PostView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const http = async (promise) => {
    setLoading((prevLoading) => prevLoading = true);
    try {
      const response = await promise();
      setLoading((prevLoading) => prevLoading = false);
      return response;
    } catch (error) {
      setLoading((prevLoading) => prevLoading = false);
      setError((prevError) => prevError = error);
      console.log(error);
    }
  };

  const fetchAllPosts = async () => {
    const response = await http(postApi.getAll);
    setPosts((prevPosts) => prevPosts = response);
  };

  const deletePost = async (id) => {
    await http(() => postApi.delete(id));
  };

  const postStore = {
    posts,
    fetchAllPosts,
    deletePost,
  }

  useEffect(() => {
    fetchAllPosts();
  }, []);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error!</div>
  if (!posts) return <div>No data.</div>
  return (
    <PostStore.Provider value={postStore}>
      <p>Post view</p>
      <Link to='/post/create'><button>Create</button></Link>
      <PostList posts={posts} />
    </PostStore.Provider>
  );
}