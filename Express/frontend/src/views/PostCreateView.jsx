import { Link } from 'react-router-dom';
import postApi from '../api/post';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

export default function PostCreateView() {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  function updateTitle(e) {
    titleRef.current = e.target.value;
  }

  function updateContent(e) {
    contentRef.current = e.target.value;
  }

  async function onCreate() {
    try {
      await postApi.create({ title: titleRef.current, content: contentRef.current });
      navigate('/post', { replace: true });
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div>
      <div>
        <p>Title</p>
        <input type="text" onChange={updateTitle} />
      </div>
      <div>
        <p>Content</p>
        <textarea onChange={updateContent}></textarea>
      </div>
      <Link to='/post'><button>Cancle</button></Link>
      <button onClick={onCreate}>OK</button>
    </div>
  )
}