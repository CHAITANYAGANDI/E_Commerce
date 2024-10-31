const express = require('express');
const { getGoogleAuthURL, getGoogleUser } = require('../Middlewares/googleAuth');

const router = express.Router();

router.get('/auth/google', (req, res) => {
    res.redirect(getGoogleAuthURL());
  });
  
router.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;

    try {
      const {accessToken,user} = await getGoogleUser(code);

      const cookieData = {

        userData:user,
        accessToken:accessToken
      }

      res.cookie('userData',JSON.stringify(cookieData),{maxAge:3600000});

    res.redirect(`http://localhost:3001/auth/google/callback`);
    
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).send('Authentication failed');
    }
  });


  router.get('/authenticate', (req,res)=>{


    const userDataCookie = req.cookies.userData;


    if (userDataCookie) {

        const userData = JSON.parse(userDataCookie);
        res.json(userData); 
    } else {
        res.status(404).json({ message: 'No user data found.' }); 
    }
  })

  module.exports = router;