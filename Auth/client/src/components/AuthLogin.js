import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import '../Auth.css';

function AuthLogin() {
    const [loginInfo, setLoginInfo] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleAuthLogin = async (e) => {
        e.preventDefault();

        const { username, password } = loginInfo;

        if (!username || !password) {
            return handleError('Username and password are required');
        }

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
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
                localStorage.setItem('AuthToken', jwtToken);
                setTimeout(() => navigate('/auth/dashboard'), 1000);
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
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleAuthLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={loginInfo.username}
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
            <div className="register-link">
                <p>Don't have an account? <Link to="/auth/register">Register here</Link></p>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AuthLogin;
