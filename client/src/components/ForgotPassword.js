import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            return handleError('Email is required');
        }

        try {
            const url = "http://localhost:7000/api/user/recovery/forgotpassword";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                localStorage.setItem('currentUserEmail', email);
                setTimeout(() => navigate('/verifyotp'), 1000);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('An error occurred');
        }
    };

    return (
        <div className='container'>
            <h1>Forgot Password</h1>
            <form onSubmit={handleForgotPassword}>
                <label htmlFor='email'>Enter your email to reset password</label>
                <input
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type='submit'>Send OTP</button>
            </form>
        </div>
    );
}

export default ForgotPassword;
