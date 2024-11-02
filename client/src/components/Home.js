import React, {useEffect,useState} from 'react'

import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

function Home(){

    const [loggedInuser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();


    useEffect(()=>{
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    },[])


    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('googleAccessToken');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('otpVerificationStatus');
        localStorage.removeItem('loggedInUser');
        handleSuccess('logged out successfully');
        setTimeout(()=>{
            navigate('/login');
        },1000)
    }

    const fetchProducts = async () =>{

        try{
            const url = "http://localhost:3000/products";
            const googleAccessToken = localStorage.getItem('googleAccessToken');
            const otpVerificationStatus = localStorage.getItem('otpVerificationStatus');
            
            const headers = {
                headers:{
                    'Authorization':localStorage.getItem('token')
                }
            }

            if (googleAccessToken) {
                headers.headers['Google_Access_Token'] = googleAccessToken;

            }

            if (otpVerificationStatus) {
                headers.headers['OTP_Verification_Status'] = otpVerificationStatus;
            }
            
            console.log(headers,'data coming from the home page from the client'); // Check that headers contain the right values
            
            // Make the fetch request with the updated headers
            const response = await fetch(url, headers
             );

            const result = await response.json();
            console.log(result);
            setProducts(Array.isArray(result) ? result : result.products || []);

        }catch (err){
            handleError(err);
        }
    }


    useEffect(()=>{
        fetchProducts();
    },[]);

    return (
        <div>
            <h1>
               Welcome {loggedInuser}
            </h1>

            <button  onClick={handleLogout}>
               Logout
            </button>
            <div>
            {products.map((item, index) => (
                    <ul key={index}>
                        <span>{item.name} : {item.price}</span>
                    </ul>
                ))}
            </div>
        </div>
    )
}

export default Home