import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

function VerifyOtp() {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (otp.length !== 4) {
            return handleError('Please enter a 4-digit OTP');
        }

        try {
            const url = "http://localhost:7000/api/user/auth/verifyotp";

            const currentUser  = localStorage.getItem('currentUserEmail');
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentUser, otp })
            });

            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);

                localStorage.setItem("otpVerificationStatus",result.message);
                setTimeout(() => navigate('/home'), 1000);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError('An error occurred');
        }
    };

    return (
        <div className='container'>
            <h1>Verify OTP</h1>
            <form onSubmit={handleVerifyOtp}>
                <label htmlFor='otp'>Enter the 4-digit OTP</label>
                <input
                    type='text'
                    placeholder='Enter OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="4"
                    required
                />
                <button type='submit'>Verify OTP</button>
            </form>
        </div>
    );
}

export default VerifyOtp;
