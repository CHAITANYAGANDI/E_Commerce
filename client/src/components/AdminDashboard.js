import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

import '../AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('AdminToken'); 
        handleSuccess('Logged out successfully'); 
        setTimeout(() => {
            navigate('/admin/login'); 
        }, 1000); 
    };

    return (
        <div className="dashboard-container">
            <div className="top-bar">
                <h1>Admin Dashboard</h1>
            </div>
            <div className="dashboard-buttons">
                <button onClick={() => navigate('/admin/register')}>Add Admin</button>
                <button onClick={() => navigate('/admin/users')}>User Management</button>
                <button onClick={() => navigate('/admin/auth')}>Auth Management</button>
                <button onClick={() => navigate('/admin/auth/protected')}>Authorized API</button>    
            </div>
            <button onClick={handleLogout} className="logout-button">
                    Logout
            </button>
        </div>
    );
}

export default AdminDashboard;
