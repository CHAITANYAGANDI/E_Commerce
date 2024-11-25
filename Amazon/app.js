const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const ProductRouter = require('./Routes/ProductRouter');

const PORT = 7003;

require('dotenv').config();
require('./Models/dbConnection');
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    
    origin:"http://localhost:3001",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
    exposedHeaders: ['x-original-url']
}));

app.use('/',ProductRouter);


app.listen(PORT,()=> {
    console.log(PORT)
})