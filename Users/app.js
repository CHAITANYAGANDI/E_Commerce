const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const AuthRouter = require('./Routes/AuthRouter');
const googleAuthRouter = require('./Routes/googleAuthRouter');
const passwordResetRouter = require('./Routes/PasswordResetRouter');
const cartRouter = require('./Routes/cartRouter');
const addressRouter = require('./Routes/addressRouter');
const OrderRouter = require('./Routes/OrderRouter');
const AdminRouter = require('./Routes/AdminRouter');
const AccountRouter = require('./Routes/AccountRouter');


const PORT = 7001;

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
app.use('/admin',AdminRouter);
app.use('/recovery',passwordResetRouter);
app.use('/account',AccountRouter);
app.use('/cart',cartRouter);
app.use('/address',addressRouter);
app.use('/order',OrderRouter);




app.listen(PORT,()=> {
    console.log(PORT)
})