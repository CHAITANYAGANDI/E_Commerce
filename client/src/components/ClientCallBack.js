import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import token from '../../../Admins/Controllers/token';

function ClientCallBack() {
  const navigate = useNavigate();

  useEffect(() => {

    async function fetchClient() {

      try {

        const urlParams = new URLSearchParams(window.location.search);

        const clientId = urlParams.get('client_id');
        const redirectUri = urlParams.get('redirectUri');
        const username = urlParams.get('username');


        const requestBody = {
          clientId,
          redirectUri,
          username
        };

        const response = await fetch('http://localhost:7000/api/admin/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {

          const token_response = await fetch('http://localhost:7000/api/admin/token', {
            method: 'GET',
            headers: {
                'client_id': clientId
            }
           });

           if (token_response.ok){

            const data = await token_response.json();

            const access_token = data.data.access_token;

            const api_name = data.data.api_name;

            // console.log(data.data.access_token,'data from token');

            localStorage.setItem(api_name+'AccessToken',access_token);

            
            navigate('/admin/dashboard');

           }

        } else {
          console.error('Failed to authenticate');
        }
      } catch (error) {
        console.error('Error handling callback:', error);
      }
    }

    fetchClient();
  }, [navigate]);

//   return <div>Authorizing...</div>;
}

export default ClientCallBack;
