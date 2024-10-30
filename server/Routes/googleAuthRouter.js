const express = require('express');
const { getGoogleAuthURL, getGoogleUser } = require('../Middlewares/googleAuth');
const { Navigate } = require('react-router-dom');

const router = express.Router();

router.get('/auth/google', (req, res) => {
    res.redirect(getGoogleAuthURL());
  });
  
router.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    console.log(code);
    try {
      const user = await getGoogleUser(code);

    res.status(200).json({user});
    
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).send('Authentication failed');
    }
  });

  module.exports = router;