import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './views/HomeView';
import PostView from './views/PostView';
import PostCreateView from './views/PostCreateView';
import PostDetailView from './views/PostDetailView';
import NotFoundView from './views/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeView />} />
        <Route path='/post' element={<PostView />} />
        <Route path='/post/:id' element={<PostDetailView />} />
        <Route path='/post/create' element={<PostCreateView />} />
        <Route path='*' element={<NotFoundView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
