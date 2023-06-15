const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(async (email, password, done) =>{
    try {
        const user = await User.findOne({ email: email });
        if (!user) { return done(null, false, {message: "Increate username"}); };
        if(!bcrypt.compare(password, user.password)){
            return done(null, false, {message: "Incorrect password"});
        }
        return done(null, user);
    } catch (error) {
        return done(err);
    }
    })
);

//create serial id
//whenevr we login it creares user id inside session
passport.serializeUser((user, done)=>{
    done(null, user.id);
});

//find session info using sesson id
passport.deserializeUser(async (id,done)=>{
    try{
        const user = await User.findById(id);
        done(null, user);
    }catch(error){
        done(error, false);
    }
});