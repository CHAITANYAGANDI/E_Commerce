const express = require('express');

const app = express();
const cors = require('cors');

const path = require('path');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const Router = require('./Routes/router');

const PORT = 5000;

require('dotenv').config();

require('./Models/dbConnection');

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
  });

app.use('/auth',Router);


app.listen(PORT,()=> {
    console.log(PORT)
})