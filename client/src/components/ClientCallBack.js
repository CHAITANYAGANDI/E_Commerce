import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ClientCallBack() {
  const navigate = useNavigate();

  useEffect(() => {

    async function fetchClient() {

      try {

        const urlParams = new URLSearchParams(window.location.search);

        const clientId = urlParams.get('clientId');
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

          const {success,message,AccessToken} = await response.json();

          localStorage.setItem('AccessToken',AccessToken);

          navigate('/admin/dashboard');


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
