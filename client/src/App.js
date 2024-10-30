import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup"; // Import the Register component
import Home from "./components/Home"; // Sample protected component
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import GoogleCallback from './components/GoogleCallBack'; 


function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const PrivateRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/login" />
    }
    return (

        <div className="App">

            <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>} />
                <Route path="/login" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route path="/home" element={< PrivateRoute element={<Home/>} />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
            </Routes>
     
        </div>
        
    );
}

export default App;
