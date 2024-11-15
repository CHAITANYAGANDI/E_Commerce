import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import '../AuthDashboard.css';
import { handleError, handleSuccess } from '../utils';

function AuthDashboard() {
    const [credentials, setCredentials] = useState([]);
    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('AuthToken');
        handleSuccess('logged out successfully');
        setTimeout(()=>{
            navigate('/auth/login');
        },1000)
    }

    useEffect(() => {

        const fetchCredentials = async () => {
            try {
                const response = await fetch('http://localhost:5000/auth/dashboard',{

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('AuthToken')}`
                    }

                });

                const result = await response.json();

                if (result.success) {
                    setCredentials(result.credentials || []);
                } else {
                    handleError(result.message || 'Failed to fetch credentials.');
                }
            } catch (err) {
                handleError(err.message);
            }
        };

        fetchCredentials();
    }, []);

    const handleCreateCredentials = () => {

        navigate('/auth/credentials');
    };

    return (
        <div className="dashboard-container">
            
            
            <div className="top-bar">
                <h1>Auth Dashboard</h1>
            
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <button onClick={handleCreateCredentials} className="create-credentials-button">
                Create New Credentials
            </button>
            <div className="credentials-list">
                {credentials.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>API Name</th>
                                <th>Creation Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {credentials.map((cred, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link 
                                            to={`/auth/creds/${cred._id}`} 
                                            className="api-link"
                                        >
                                            {cred.api_name}
                                        </Link>
                                    </td>
                                    <td>{new Date(cred.creation_date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No credentials created yet.</p>
                )}
            </div>
        </div>
    );
}

export default AuthDashboard;
