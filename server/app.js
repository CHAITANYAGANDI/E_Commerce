const express = require('express');

// const session = require("express-session");

// const passport = require('passport');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

const googleAuthRouter = require('./Routes/googleAuthRouter');

// const auth = require("./Routes/auth");

const PORT = 3000;

require('dotenv').config();

require('./Models/db');


// app.use(passport.initialize());
// app.use(passport.session());



app.use(bodyParser.json());
app.use(cors({
    origin:"http://localhost:3001",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));
app.use('/authone',AuthRouter);
app.use('/products',ProductRouter);
app.use('/',googleAuthRouter);




app.listen(PORT,()=> {
    console.log(PORT)
})