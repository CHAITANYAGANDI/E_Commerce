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
        secret_key:''
    });

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('AuthToken');
        handleSuccess('logged out successfully');
        setTimeout(()=>{
            navigate('/auth/login');
        },1000)
    }

    const handleBack = (e) => {
        
        setTimeout(()=>{
            navigate('/auth/dashboard');
        },1000)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentialInfo({ ...credentialInfo, [name]: value });
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
        <div className="create-credentials-container">
            <div className="top-bar">
                <button onClick={handleBack} className="back-button">&#8592; Back</button>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <h1>Create New Credentials</h1>
            <form onSubmit={handleSubmit} className="create-credentials-form">
                <div className="form-group">
                    <label htmlFor="api_name">API Name</label>
                    <input
                        type="text"
                        name="api_name"
                        placeholder="Enter API name"
                        value={credentialInfo.api_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="api_url">API URL</label>
                    <input
                        type="url"
                        name="api_url"
                        placeholder="Enter API URL"
                        value={credentialInfo.api_url}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="redirect_uri">Redirect URI</label>
                    <input
                        type="url"
                        name="redirect_uri"
                        placeholder="Enter Redirect URI"
                        value={credentialInfo.redirect_uri}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="secret_key">Secret Key</label>
                    <input
                        type="text"
                        name="secret_key"
                        placeholder="Enter Secret Key"
                        value={credentialInfo.secret_key}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="save-button">Save</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default CreateCredentials;
