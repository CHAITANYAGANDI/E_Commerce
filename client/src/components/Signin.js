import React, { useEffect,useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../utils'

function Login(){
    const [loginInfo,setloginInfo] = useState({
        email:'',
        password:''
    })

    const navigate = useNavigate();
    
    const handleChange = (e)=>{
        const {name,value} = e.target;
 
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setloginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        const {email,password} = loginInfo;

        if (!email || !password){
            return handleError('email and password are required')
        }

        try{
            const url = "http://localhost:7000/api/user/auth/login";

            const response = await fetch(url,{
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(loginInfo)
            });

            const result = await response.json();

        
            const {success, message, jwtToken,name,email, error} = result;
            if (success){
                handleSuccess(message);
                localStorage.setItem('token',jwtToken);
                localStorage.setItem('loggedInUser',name);
                localStorage.setItem('currentUserEmail',email);
                setTimeout(()=>{
                    navigate('/mfauth')
                },1000)
            }else if (error){
                const details = error?.details[0].message;
                handleError(details);
            }
            else if(!success){
                handleError(message);
            }
         
        } catch(err){
            handleError(err);
        }
    }
    
    return (
        <div className='container'>
            <h1>
                Login
            </h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>
                        Email
                    </label>
                    <input
                    onChange={handleChange}
                    type='email'
                    name='email'
                    autoFocus
                    placeholder='Enter your email'
                    value={loginInfo.email}/>
                </div>
                <div>
                    <label htmlFor='password'>
                        Password
                    </label>
                    <input
                    onChange={handleChange}
                    type='password'
                    name='password'
                    autoFocus
                    placeholder='Enter your password'
                    value={loginInfo.password}/>
                </div>
                <button type='submit'>Sign In</button>
                <span>Don't have an account ?
                    <Link to="/signup">Register</Link>
                </span>
                <span>
                    <Link to="/forgotpassword" style={{ marginTop: '10px', display: 'block' }}>
                        Forgot Password?
                    </Link>
                </span>
            </form>
            {/* Google Sign-In Button */}
            {/* <button onClick={handleGoogleLogin} style={{ marginTop: '20px' }}>
                Sign in with Google
            </button> */}
            <form action="http://localhost:7000/api/user/auth/google" method="GET">
                <input 
                    type="submit" 
                    value="Sign in with Google" 
                    style={{ marginTop: '20px' }}
                />
            </form>
            <ToastContainer/>
        </div>
    )
}

export default Login