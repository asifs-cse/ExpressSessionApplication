const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const app = express();
require("./config/database");
require("dotenv").config();
require("./config/passport");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//set view engine
app.set("view engine", "pug");
app.set('views', './views/');
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    // cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// base url
app.get("/", (req, res) => {
  res.render("index");
});

// register : get
app.get("/register", (req, res) => {
  res.render("register");
});

// register : post
//register post route
app.post("/register",async (req, res)=>{
    try {
        const user = await userModel.findOne({email: req.body.email});
        if(user){
            return res.status(400).send("user is already created");
        }else{
            bcrypt.hash(req.body.password,  saltRounds,async (err, hash)=>{
                const newUser = new userModel({
                  userFirstName: req.body.userFirstName,
                  userLastName: req.body.userLastName,
                  email: req.body.email,
                  phone: req.body.phone,
                  password: hash
                });
                await newUser.save();
                res.status(201).redirect("/login");
            })
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
  });
  

const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

// login : get
app.get("/login", checkLoggedIn, (req, res) => {
  res.render("login");
});

// login : post
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  })
);

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// profile protected route
app.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile");
});

// logout route
app.get("/logout", (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;