const axios = require('axios');

require('dotenv').config()

function getGoogleAuthURL() {
    const redirectUri = 'http://localhost:3000/auth/google/callback';
    return `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&scope=openid%20email%20profile&response_type=code`;
  }

async function getGoogleUser(code) {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/auth/google/callback',
      grant_type: 'authorization_code'
    });



    const accessToken = response.data.access_token;
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
    });
    return {
      accessToken: accessToken,
      user: userResponse.data
  };
}

module.exports = {
getGoogleAuthURL,
getGoogleUser,
};