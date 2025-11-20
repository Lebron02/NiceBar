import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';

import Navbar from './components/Navbar';

import Login from './pages/login/Login'
import Register from './pages/register/Register';
import User from './pages/user/User'
import ChangePassword from './pages/user/ChangePassword'
import ChangeAddress from './pages/user/ChangeAddress';
import UserPromote from './pages/user/UserPromote';

import Blog from './pages/blog/Blog';
import AddPost from './pages/blog/AddPost';
import SinglePost from './pages/blog/SinglePost';

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Blog />} />
          <Route path="/add-post" element={<AddPost />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/account" element={<User />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/change-address" element={<ChangeAddress />} />
          <Route path="/user-promote" element={<UserPromote />} />

          <Route path="/posts/:id" element={<SinglePost />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
