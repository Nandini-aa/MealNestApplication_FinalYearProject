import './App.css';
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MealNestHomepage from './MealNestHomepage';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import LoginPage from './pages/LoginPage';
import CateringForm from './pages/CateringForm';
import CustomerDashboard from './pages/CustomerDashboard';
import ViewOrders from './pages/ViewOrders';
import ChefDashboard from './pages/ChefDashboard';
import ChefOrdersPage from './pages/ChefOrdersPage';
import NavBar from './pages/NavBar';
import OrderHistory from './pages/OrderHistory';

function App() {

  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from localStorage or some global state
    const userEmail = localStorage.getItem('userEmail'); // Example
    setEmail(userEmail); // Set the email in state
  }, []);
  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
    <Route path="/mealnest" element={<MealNestHomepage />}/>
    <Route path="/Register" element={<Register />}/>
    <Route path="/Admin/login" element={<AdminLogin />}/>
    <Route path="/login" element={<LoginPage />}/>
    <Route path="/upload-catering" element={<CateringForm />} />
    <Route path="/view-orders" element={<ViewOrders />} />
    <Route path="/customer-dashboard" element={<CustomerDashboard />} />
    <Route path="/chef-dashboard" element={<ChefDashboard />} />
    <Route path="/view-orders/:cateringId" element={<ChefOrdersPage />} />
    <Route path='/navbar' element={<NavBar/>}/>
    <Route path="/order-history" element={<OrderHistory  email={email}  />} />
    </Routes>
    </Router>
  );
}

export default App;
