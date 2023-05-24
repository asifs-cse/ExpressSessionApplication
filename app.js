const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/database');
const app = express();

dbConnect();

//set view engine pug
app.set('view engine','pug');
app.set('views','./views/');
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//store sesson in mongodb


//create route
//base url
app.get('/',(req, res)=>{
  res.render('index');
})

//register get route
app.get('/regiser', (req, res)=>{
  res.render('register');
})
//register post route
app.post('/register',(req, res)=>{
  
})


module.exports = app;
