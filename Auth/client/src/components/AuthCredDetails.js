import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { handleError,handleSuccess } from '../utils';
import '../AuthCredDetails.css';

function CredentialDetails() {
    const { id } = useParams();
    const [credential, setCredential] = useState(null);

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
            }
        };

        fetchCredentialDetails();
    }, [id]);

    return credential ? (
        <div className="credential-details">
            <div className="top-bar">
                <button onClick={handleBack} className="back-button">&#8592; Back</button>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <h2>Credential Details for {credential.api_name}</h2>
            <p><strong>API Name:</strong> {credential.api_name}</p>
            <p><strong>Creation Date:</strong> {new Date(credential.creation_date).toLocaleDateString()}</p>
            <p><strong>Client ID:</strong> {credential.client_id}</p>
            <p><strong>Client Secret:</strong> {credential.client_secret}</p>
            <p><strong>API URL:</strong> {credential.api_url}</p>
            <p><strong>Redirect URI:</strong> {credential.redirect_uri}</p>
        </div>
    ) : (
        <p>Loading...</p>
    );
}

export default CredentialDetails;
