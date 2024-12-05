import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import '../AuthCredentials.css';

function CreateCredentials() {
    const [credentialInfo, setCredentialInfo] = useState({
        api_name: '',
        api_url: '',
        redirect_uri: '',
        secret_key: ''
    });

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('AuthToken');
        handleSuccess('Logged out successfully');
        setTimeout(() => {
            navigate('/auth/login');
        }, 1000);
    };

    const handleBack = (e) => {
        setTimeout(() => {
            navigate('/auth/dashboard');
        }, 1000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentialInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { api_name, api_url, redirect_uri, secret_key } = credentialInfo;

        if (!api_name || !api_url || !redirect_uri || !secret_key) {
            return handleError('All fields are required');
        }

        try {
            const response = await fetch('http://localhost:5000/auth/credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('AuthToken')}`
                },
                body: JSON.stringify(credentialInfo)
            });

            const result = await response.json();
            const { success, message, error } = result;

            if (success) {
                handleSuccess('Credentials created successfully');
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
        <div className="credentials-container">
            <div className="credentials-wrapper">
                <div className="credentials-header">
                    <div className="header-actions">
                        <button 
                            onClick={handleBack} 
                            className="action-button back-button"
                        >
                            <i className="fas fa-arrow-left"></i> Back
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="action-button logout-button"
                        >
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>

                <div className="credentials-content">
                    <h1>Create New API Credentials</h1>
                    <form onSubmit={handleSubmit} className="credentials-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="api_name">API Name</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-tag"></i>
                                    <input
                                        type="text"
                                        id="api_name"
                                        name="api_name"
                                        placeholder="Enter API name"
                                        value={credentialInfo.api_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="api_url">API URL</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-link"></i>
                                    <input
                                        type="url"
                                        id="api_url"
                                        name="api_url"
                                        placeholder="https://api.example.com"
                                        value={credentialInfo.api_url}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="redirect_uri">Redirect URI</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-redo"></i>
                                    <input
                                        type="url"
                                        id="redirect_uri"
                                        name="redirect_uri"
                                        placeholder="https://example.com/callback"
                                        value={credentialInfo.redirect_uri}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="secret_key">Secret Key</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-key"></i>
                                    <input
                                        type="password"
                                        id="secret_key"
                                        name="secret_key"
                                        placeholder="Enter secret key"
                                        value={credentialInfo.secret_key}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="submit-button">
                            <i className="fas fa-save"></i> Save Credentials
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CreateCredentials;
