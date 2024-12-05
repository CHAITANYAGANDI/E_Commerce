import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import '../AuthCredDetails.css';

function CredentialDetails() {
    const { id } = useParams();
    const [credential, setCredential] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchCredentialDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/auth/creds/apiinfo/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('AuthToken')}`
                    }
                });

                const result = await response.json();
                
                if (result.success) {
                    setCredential(result.credential);
                } else {
                    handleError(result.message || 'Failed to fetch credential details.');
                }
            } catch (err) {
                handleError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCredentialDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="credential-details-container">
                <div className="loader-wrapper">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    if (!credential) {
        return (
            <div className="credential-details-container">
                <div className="error-message">
                    <p>No credential details found</p>
                    <button onClick={handleBack} className="back-to-dashboard">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="credential-details-container">
            <div className="credential-details-wrapper">
                <div className="credential-header">
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

                <div className="credential-content">
                    <h1>Credential Details</h1>
                    <div className="details-grid">
                        <div className="detail-card">
                            <div className="detail-icon">
                                <i className="fas fa-tag"></i>
                            </div>
                            <div className="detail-info">
                                <h3>API Name</h3>
                                <p>{credential.api_name}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon">
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div className="detail-info">
                                <h3>Creation Date</h3>
                                <p>{new Date(credential.creation_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon">
                                <i className="fas fa-id-badge"></i>
                            </div>
                            <div className="detail-info">
                                <h3>Client ID</h3>
                                <p>{credential.client_id}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon">
                                <i className="fas fa-key"></i>
                            </div>
                            <div className="detail-info">
                                <h3>Client Secret</h3>
                                <p>{credential.client_secret}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon">
                                <i className="fas fa-link"></i>
                            </div>
                            <div className="detail-info">
                                <h3>API URL</h3>
                                <p>{credential.api_url}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon">
                                <i className="fas fa-redo"></i>
                            </div>
                            <div className="detail-info">
                                <h3>Redirect URI</h3>
                                <p>{credential.redirect_uri}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CredentialDetails;