import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Home from "./components/Home"; 
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import GoogleCallback from './components/GoogleCallBack'; 
import ForgotPassword from './components/ForgotPassword';
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';
import TwoFactorAuthentication from './components/twoFactorAuthentication';


function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const PrivateRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/login" />
    }
    return (

        <div className="App">
            <Routes>
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/verifyotp" element={<VerifyOtp />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
            </Routes>


            <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>} />
                <Route path="/login" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={< PrivateRoute element={<Home/>} />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                <Route path="/mfauth" element={<TwoFactorAuthentication />} />
            </Routes>
     
        </div>
        
    );
}

export default App;
