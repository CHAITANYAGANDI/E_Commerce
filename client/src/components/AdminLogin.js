import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import '../AdminLogin.css';

function AdminLogin() {
    const [loginInfo, setLoginInfo] = useState({
        adminname: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();

        const { adminname, password } = loginInfo;

        if (!adminname || !password) {
            return handleError('Adminname and password are required');
        }

        try {
            const response = await fetch('http://localhost:5001/admin/login', {
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

                console.log(error);
                handleError(error.details[0].message);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleAdminLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="adminname">Admin Name</label>
                    <input
                        type="text"
                        name="adminname"
                        placeholder="Enter your Admin Name"
                        value={loginInfo.adminname}
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
    );
}

export default AdminLogin;
