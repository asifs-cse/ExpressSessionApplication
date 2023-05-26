const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/database');
require('./config/database');
const userModel = require('./models/user.model');
const app = express();

dbConnect();

//create session using mongodb
const mongoStore = require('connect-mongo');
const passport = require('passport');
const session = require('express-session');

//create session
app.set('trust proxy',1);
app.use(
  session({
    secret: 'keybord cat',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/passportAuthUser',
      collectionName: 'sessions',
    })
  })
)

//initialize passport and session
app.use(passport.initialize());
app.use(passport.session());



//set view engine pug
app.set('view engine','pug');
app.set('views','./views/');
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

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

//check login
const checkLoggedIn = (req, res, next)=>{
  if(req.isAuthenticated()){
    return res.redirect('/profile');
  }
  next();
}
//login get route
app.get('/login', checkLoggedIn, (req, res)=>{
  res.render('login');
})

//login post route
app.post('/login', passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/profile'}),
function(req, res){
  res.redirect('/');
})

//protected route
const checkAuthed = (req, res)=>{
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/login');
  }
}
//profile route
app.get('/profile', checkAuthed, (req, res)=>{
  res.send('/profile')
})

//logout route
app.get('/logout', async (req, res)=>{
  try {
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      res.redirect('/');
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
})

module.exports = app;
