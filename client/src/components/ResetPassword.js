import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            return handleError('Both fields are required');
        }

        if (password !== confirmPassword) {
            return handleError('Passwords do not match');
        }

        try {
            const url = "http://localhost:7000/api/user/recovery/resetpassword";
            const email  = localStorage.getItem('currentUserEmail');
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                setTimeout(() => navigate('/login'), 1000);  
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('An error occurred');
        }
    };

    return (
        <div className='container'>
            <h1>Reset Password</h1>
            <form onSubmit={handleResetPassword}>
                <label htmlFor='password'>New Password</label>
                <input
                    type='password'
                    placeholder='Enter new password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor='confirmPassword'>Confirm New Password</label>
                <input
                    type='password'
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type='submit'>Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;
