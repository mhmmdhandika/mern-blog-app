import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SharedLayout from './components/SharedLayout';
import { UserContextProvider } from './context/UserContext';
import CreatePost from './pages/CreatePost';
import EditPage from './pages/EditPage';
import Home from './pages/Home';
import Login from './pages/Login';
import PostPage from './pages/PostPage';
import Register from './pages/Register';

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<SharedLayout />}>
            <Route index element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/create' element={<CreatePost />} />
            <Route path='/blog/post/:id' element={<PostPage />} />
            <Route path='/blog/edit/:id' element={<EditPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
