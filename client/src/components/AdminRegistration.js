import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import '../AdminRegistration.css';

function AdminRegistration() {
    const [formData, setFormData] = useState({
        name: '',
        adminId: '',
        password: ''
    });
    const handleLogout = () => {
        localStorage.removeItem('AdminToken');
        handleSuccess('Logged out successfully');
        setTimeout(() => {
          navigate('/admin/login');
        }, 1000);
      };
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { name, adminId, password } = formData;
        
        if (!name || !adminId  || !password) {
            return handleError('All fields are required');
        }
        
        try {
            const response = await fetch('http://localhost:7000/api/user/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('AdminToken'),
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            const { success, message, error } = result;
            
            if (success) {
                handleSuccess(message);
                setTimeout(() => navigate('/admin/dashboard'), 1000);
            } else if (error) {
               
                handleError(error.details[0].message);
            } else {
                console.log(message);
                if (message.toLowerCase().includes('token has expired')){
                    handleLogout();
                  }
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };
    
    return (
        <div className="registration-container">
            <h1>Create an Admin Account</h1>
            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="adminId">Admin ID</label>
                    <input
                        type="text"
                        name="adminId"
                        placeholder="Enter your Admin ID"
                        value={formData.adminId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="register-button">Add Admin</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default AdminRegistration;
