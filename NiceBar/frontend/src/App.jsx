import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';

import Navbar from './components/Navbar';

import Login from './pages/login/Login'
import Register from './pages/register/Register';
import User from './pages/user/User'

import Blog from './pages/blog/Blog';
import AddPost from './pages/blog/AddPost';
import SinglePost from './pages/blog/SinglePost';

// import Dashboard from './components/Dashboard';

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
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}

          <Route path="/:id" element={<SinglePost />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
