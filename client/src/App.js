import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useState,useEffect  } from 'react';

import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Home from "./components/Home"; 
import RefreshHandler from './RefreshHandler';
import GoogleCallback from './components/GoogleCallBack'; 
import ForgotPassword from './components/ForgotPassword';
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';
import TwoFactorAuthentication from './components/twoFactorAuthentication';
import AdminLogin from "./components/AdminLogin";
import AdminRegistration from "./components/AdminRegistration";
import AdminDashboard from "./components/AdminDashboard";
import AuthManagement from "./components/AuthManagement";
import AuthRequest from "./components/AuthRequest";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ClientCallBack from "./components/ClientCallBack";
import ProductDetails from "./components/ProductDetails";
import Cart from './components/Cart';
import Address from './components/Address';
import Checkout from './components/Checkout';
import UserManagement from './components/UserManagement';



function App() {

    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [loading, setLoading] = useState(true);

    // const PrivateRoute = ({ element }) => {
    //     return isAuthenticated ? element : <Navigate to="/login" />
    // }

    return (

        <div className="App">
            
            {/* <RefreshHandler setIsAuthenticated={setIsAuthenticated} /> */}
            <Routes>
                <Route path="/" element={<Navigate to="/home"/>} />
                <Route path="/login" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/product/:source/:productId" element={<ProductDetails />} />
                <Route path="/home" element={<Home/>} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/address/new" element={<Address />} />
                <Route path="/checkout" element={<Checkout />} />
                
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                <Route path="/mfauth" element={<TwoFactorAuthentication />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/verifyotp" element={<VerifyOtp />} />
                <Route path="/resetpassword" element={<ResetPassword />} />


                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/client/callback" element={<ClientCallBack />} />
                <Route path="/admin/register" element={<AdminRegistration />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/auth" element={<AuthManagement />} />
                <Route path="/admin/auth/request" element={<AuthRequest />} />
                <Route path="/admin/auth/protected" element={<ProtectedRoutes />} />
                <Route path="/admin/users" element={<UserManagement />} />



                {/* <Route path="/home" element={< PrivateRoute element={<Home/>} />} />  */}
            </Routes>
     
        </div>
        
    );
}

export default App;
