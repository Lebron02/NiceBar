import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import { ShopProvider } from './services/ShopContext';

import Navbar from './components/Navbar';

import Login from './pages/login/Login'
import Register from './pages/register/Register';
import User from './pages/user/User'

import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductEdit from './pages/admin/ProductEdit';

import Blog from './pages/blog/Blog';
import AddPost from './pages/blog/AddPost';
import SinglePost from './pages/blog/SinglePost';

import HomePage from './pages/shop/HomePage';
import SingleProduct from './pages/shop/SingleProduct';
import Cart from './pages/shop/Cart';
import Payment from './pages/shop/PaymentPage';


import './App.css'
import PlaceOrder from './pages/shop/PlaceOrder';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:slug" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/payment" element={<Payment />} />


            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/add-post" element={<AddPost />} />
            <Route path="/blog/:slug" element={<SinglePost />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/account" element={<User />} />
            
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/product/create" element={<ProductEdit />} />
              <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
