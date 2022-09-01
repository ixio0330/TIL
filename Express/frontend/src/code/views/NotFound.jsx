import { Link } from 'react-router-dom';

export default function NotFoundView() {
  return (
    <div>
      <h1>404</h1>
      <h3>Not Found</h3>
      <Link to='/post'>Back to Post</Link>
    </div>
  )
}