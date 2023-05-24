const express = require('express');
const cors = require('cors');
const app = express();


//set view engine pug
app.set('view engine','pug');
app.set('views','./views/');
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/',(req, res)=>{
  res.render('index');
})

module.exports = app;
