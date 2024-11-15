const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const AdminRouter = require('./Routes/AdminRouter');

const PORT = 7002;

require('dotenv').config();
require('./Models/dbConnection');
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    
    origin:"http://localhost:3001",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));


app.use('/',AdminRouter);


app.listen(PORT,()=> {
    console.log(PORT)
})