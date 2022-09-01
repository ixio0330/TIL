import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import postApi from '../api/post';

export default function PostDetailView() {
  const { id } = useParams();
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

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

  const fetchPost = async () => {
    const response = await http(() => postApi.getById(id));
    setPost((prevPost) => prevPost = response);
  }

  const onSavePost = async () => {
    await http(() => postApi.update({ id, title: titleRef.current, content: contentRef.current }));
    await fetchPost();
    updateIsUpdate();
  };

  const updateIsUpdate = () => {
    setIsUpdate((prevIsUpdate) => prevIsUpdate = !prevIsUpdate);
  };

  function updateTitle(e) {
    titleRef.current = e.target.value;
  }

  function updateContent(e) {
    contentRef.current = e.target.value;
  }

  useEffect(() => {
    fetchPost();
  }, []);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error!</div>
  if (!post) return <div>No data.</div>
  return (
    <div>
      {
        isUpdate ? 
        <>
          <div>
            <p>Title</p>
            <input type="text" defaultValue={post.title} ref={titleRef} onChange={updateTitle} />
          </div>
          <div>
            <p>Content</p>
            <textarea defaultValue={post.content} ref={contentRef} onChange={updateContent}></textarea>
          </div>
          <button onClick={updateIsUpdate}>Cancle</button>
          <button onClick={onSavePost}>Save</button>
        </> : 
        <>
          <p>{post.title}</p>
          <p>{post.content}</p>
          <Link to='/post'><button>Back</button></Link>
          <button onClick={updateIsUpdate}>Update</button>
        </>
      }
    </div>
  )
}