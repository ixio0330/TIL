import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './code/views/HomeView';
import PostView from './code/views/PostView';
import PostCreateView from './code/views/PostCreateView';
import PostDetailView from './code/views/PostDetailView';
import NotFoundView from './code/views/NotFound';

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