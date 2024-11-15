import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGoogleAuth() {
      try {
        const response = await fetch('http://localhost:7000/api/user/authenticate', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();

          if (data.accessToken){

            localStorage.setItem('googleAccessToken',data.accessToken);
            navigate('/home');
            
          }

          else{
            console.error('No access token found');
          }

        } else {
          console.error('Failed to authenticate');
        }
      } catch (error) {
        console.error('Error handling callback:', error);
      }
    }

    fetchGoogleAuth();
  }, [navigate]);

  return <div>Authenticating...</div>;
}

export default GoogleAuthCallback;
