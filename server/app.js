const express = require('express');

// const session = require("express-session");

// const passport = require('passport');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

// const auth = require("./Routes/auth");

const PORT = 5000;

require('dotenv').config();

require('./Models/db');


// app.use(passport.initialize());
// app.use(passport.session());



app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter);
app.use('/products',ProductRouter);




app.listen(PORT,()=> {
    console.log(PORT)
})