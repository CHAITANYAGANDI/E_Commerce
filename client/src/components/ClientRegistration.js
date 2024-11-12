import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import '../ClientRegistrations.css';

function ClientRegistration() {
    const [registrationInfo, setRegistrationInfo] = useState({
        username: '',
        password: ''
    });
    
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegistrationInfo({ ...registrationInfo, [name]: value });
    };
    
    const handleRegistration = async (e) => {
        e.preventDefault();
        
        const { username, password } = registrationInfo;
        
        if (!username || !password) {
            return handleError('Username and password are required');
        }
        
        try {
            const response = await fetch('http://localhost:3000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationInfo)
            });
            
            const result = await response.json();
            const { success, message, error } = result;
            
            if (success) {
                handleSuccess(message);
                setTimeout(() => navigate('/login'), 1000);
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
        <div className="registration-container">
            <h1>Create an Account</h1>
            <form onSubmit={handleRegistration} className="registration-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={registrationInfo.username}
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
                        value={registrationInfo.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="register-button">Register</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default ClientRegistration;
