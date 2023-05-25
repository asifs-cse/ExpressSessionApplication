const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/database');
const userModel = require('./models/user.model');
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
app.get('/home',(req, res)=>{
  res.render('index');
})
//register get route
app.get('/register', (req, res)=>{
  res.render('register');
})
//register post route
app.post('/register',async (req, res)=>{
  try {
    //check user
    const user = await userModel.findOne({email: req.body.email});
    if(user){
      return res.status(400).send('User is already created, try to login');
    }else{
      const newUser = new userModel({
        userFirstName: req.body.userFirstName,
        userLastName: req.body.userLastName,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      })
      await newUser.save();
      res.status(201).redirect('/login');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//login get route
app.get('/login', async (req, res)=>{
  res.render('login');
})

//logout route
app.get('/logout', async (req, res)=>{
  res.send('logout');
})

//profile route
app.get('/profile', async (req, res)=>{
  res.send('profile')
})

module.exports = app;
