import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import { ShopProvider } from './services/ShopContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/login/Login'
import Register from './pages/register/Register';

import UserAddress from './pages/user/UserAddress';
import UserDashboard from './pages/user/UserDashboard';
import UserLayout from './pages/user/UserLayout';
import UserOrders from './pages/user/UserOrders';
import UserSettings from './pages/user/UserSettings';

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
import PlaceOrder from './pages/shop/PlaceOrder';

import Contact from './pages/subpages/Contact';
import ShippingPage from './pages/subpages/Shipping';
import ReturnsPage from './pages/subpages/Returns';
import PrivacyPage from './pages/subpages/Privacy';
import AboutPage from './pages/subpages/About';

import './App.css'



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
            
            <div className="flex flex-col min-h-screen"> 

              <Navbar />
              <main className="flex-grow">
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
                  
                  <Route path="/account" element={<UserLayout />}>
                      <Route index element={<UserDashboard />} />      
                      <Route path="orders" element={<UserOrders />} />   
                      <Route path="address" element={<UserAddress />} /> 
                      <Route path="settings" element={<UserSettings />} />
                  </Route>
                  
                  <Route element={<AdminRoute />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/product/create" element={<ProductEdit />} />
                    <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
                  </Route>

                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/shipping" element={<ShippingPage />} />
                  <Route path="/returns" element={<ReturnsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer /> 
           </div>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
