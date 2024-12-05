import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from 'react';
import AuthRegistration from "./components/AuthRegistration";
import AuthLogin from "./components/AuthLogin";
import AuthDashboard from "./components/AuthDashboard";
import AuthCredentials from "./components/AuthCredentials";
import AuthCredDetails from "./components/AuthCredDetails";
// import RefreshHandler from './RefreshHandler';

function App() {

    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // const PrivateRoute = ({ element }) => {
    //     return isAuthenticated ? element : <Navigate to="/login" />
    // }
    return (

        <div className="App">
          
          {/* <RefreshHandler setIsAuthenticated={setIsAuthenticated} /> */}
            <Routes>
                <Route path="/" element={<Navigate to="/auth/login"/>} />
                <Route path="/auth/register" element={<AuthRegistration />} />
                <Route path="/auth/login" element={<AuthLogin />} />
                <Route path="/auth/dashboard" element={<AuthDashboard />} />
                <Route path="/auth/credentials" element={<AuthCredentials />} />
                <Route path="/auth/creds/:id" element={<AuthCredDetails />} />
            </Routes>
        </div>
        
    );
}

export default App;
