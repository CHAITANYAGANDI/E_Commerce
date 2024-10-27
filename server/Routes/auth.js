const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true

    },

    function(request, accessToken, refreshsToken, profile, done){

        const userPayload = {
            id: profile.id,
            email: profile.email,
            name: profile.displayName
        };
    

        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    

        return done(null, { profile, token });


    }
));

passport.serializeUser(function(user,done){
    done(null, user);
});


passport.deserializeUser(function(user,done){
    done(null,user);
});


app.get('/auth/google',
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
  ));
  
  app.get( '/auth/google/callback',
      passport.authenticate( 'google', {
          successRedirect: '/protected',
          failureRedirect: '/failure'
  }));

  //   app.get('/failure',(req,res)=>{
//     res.send("someting went wrong");
//   });

// app.get('/protected',isUserLoggedIn,(req,res)=>{
//     res.send("hello");
// })
