import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

import '../AuthRequest.css';

function RequestAuthorization() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        apiName: '',
        clientId: '',
        clientSecret: '',
        redirectUri: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogout = () => {
        localStorage.removeItem('AdminToken');
        handleSuccess('Logged out successfully');
        setTimeout(() => {
            navigate('/admin/login');
        }, 1000);
    };

    const handleBack = () => {
        navigate('/admin/dashboard');
    };

    const handleAuthorize = async (e) => {
        e.preventDefault();

        const { apiName, clientId, clientSecret, redirectUri } = formData;

        if (!apiName || !clientId || !clientSecret || !redirectUri) {
            return handleError('All fields are required');
        }

        const response = await fetch('http://localhost:7000/api/user/admin/client/details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('AdminToken'),
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {

        const callbackUrl = encodeURIComponent(`http://localhost:3001/admin/client/callback?fromLogin=true`);

        window.location.href = `http://localhost:5000/auth/client/login?callbackUrl=${callbackUrl}&client_id=${encodeURIComponent(clientId)}`;

        }
        else{

            const errorData = await response.json();
            if (errorData.message.toLowerCase().includes('token has expired')){
                handleLogout();
              }
        }
    };

    return (
        <div className="request-auth-container">
            <div className="top-bar">
                <button onClick={handleBack} className="back-button">&#8592; Back</button>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <h3>Request API Authorization</h3>
            <form onSubmit={handleAuthorize} className="auth-form">
                <div className="form-group">
                    <label htmlFor="apiName">API Name</label>
                    <input
                        type="text"
                        name="apiName"
                        placeholder="Enter API Name"
                        value={formData.apiName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="clientId">Client ID</label>
                    <input
                        type="text"
                        name="clientId"
                        placeholder="Enter Client ID"
                        value={formData.clientId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="clientSecret">Client Secret</label>
                    <input
                        type="text"
                        name="clientSecret"
                        placeholder="Enter Client Secret"
                        value={formData.clientSecret}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="redirectUri">Redirect URI</label>
                    <input
                        type="url"
                        name="redirectUri"
                        placeholder="Enter Redirect URI"
                        value={formData.redirectUri}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="authorize-button">Authorize</button>
            </form>
        </div>
    );
}

export default RequestAuthorization;
