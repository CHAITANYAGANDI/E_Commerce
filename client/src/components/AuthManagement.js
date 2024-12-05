import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

import '../AuthManagement.css';

function AuthManagement() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('AuthToken');
        handleSuccess('Logged out successfully');
        setTimeout(() => {
            navigate('/admin/login');
        }, 1000);
    };

    const handleBack = () => {
        navigate('/admin/dashboard');
    };

    return (
        <div className="auth-management-container">
             <div className="top-bar">
                <button onClick={handleBack} className="back-button">&#8592; Back</button>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <h2>Auth Management</h2>
            <div className="auth-buttons">
                <button onClick={() => navigate('/admin/auth/request')}>Request API Authorization</button>
                
            </div>
        </div>
    );
}

export default AuthManagement;
