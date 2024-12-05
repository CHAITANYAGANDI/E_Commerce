import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import '../AdminLogin.css';

function AdminLogin() {
    const [loginInfo, setLoginInfo] = useState({
        adminId: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();

        const { adminId, password } = loginInfo;

        if (!adminId || !password) {
            return handleError('Adminname and password are required');
        }

        try {
            const response = await fetch('http://localhost:7000/api/user/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });

            const result = await response.json();
            const { success, jwtToken, message, error } = result;

            if (success) {
                handleSuccess('Login successful');
                localStorage.setItem('AdminToken', jwtToken);
                setTimeout(() => navigate('/admin/dashboard'), 1000);
            } else if (error) {


                handleError(error.details[0].message);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="login-page">
            <div className="welcome-message">
                <h1>Welcome to Trendy Treasures Admin Portal</h1>
                <p>Your secure gateway to managing operations efficiently.</p>
            </div>
    
            <div className="login-container">
                <h1>Admin Login</h1>
                <form onSubmit={handleAdminLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="adminId">Admin ID</label>
                        <input
                            type="text"
                            name="adminId"
                            placeholder="Enter your Admin ID"
                            value={loginInfo.adminId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
    
}

export default AdminLogin;
