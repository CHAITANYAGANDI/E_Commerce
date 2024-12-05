import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

        const response = await fetch('http://localhost:7000/api/user/admin/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('AdminToken'),
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {

          const token_response = await fetch('http://localhost:7000/api/user/admin/token', {
            method: 'GET',
            headers: {
                'client_id': clientId,
                'Authorization': localStorage.getItem('AdminToken'),
            }
           });

           if (token_response.ok){

            const data = await token_response.json();

            const access_token = data.data.access_token;

            const api_name = data.data.api_name;

            localStorage.setItem(api_name+'_AccessToken',access_token);

            
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

}

export default ClientCallBack;
