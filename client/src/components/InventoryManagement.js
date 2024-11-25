import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

import '../ProductManagement.css'; // Import the CSS file for styling

function ProductManagement() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('AdminToken'); // Remove the auth token from local storage
        handleSuccess('Logged out successfully'); // Show success message
        setTimeout(() => {
            navigate('/admin/login'); // Redirect to the admin login page after logout
        }, 1000); // Add a slight delay to allow success message display
    };

    return (
        <div className="dashboard-container">
            <div className="top-bar">
                <h1>Inventory Management</h1>
            </div>
            <div className="dashboard-buttons">

                <button onClick={() => navigate('/admin/products/get')}>Available Inventory</button>
                <button onClick={() => navigate('/admin/products/modify')}>Update Inventory</button>

            </div>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </div>
    );
}

export default ProductManagement;
