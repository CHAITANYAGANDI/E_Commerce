const express = require('express');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

const googleAuthRouter = require('./Routes/googleAuthRouter');


const passwordResetRouter = require('./Routes/PasswordResetRouter');


const PORT = 3000;

require('dotenv').config();

require('./Models/db');


app.use(bodyParser.json());

app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:3001",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use('/',googleAuthRouter);
app.use('/auth',AuthRouter);
app.use('/products',ProductRouter);
app.use('/recovery',passwordResetRouter);


app.listen(PORT,()=> {
    console.log(PORT)
})