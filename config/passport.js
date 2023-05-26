const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(async (gmail, password, done)=>{
    try {
        const user = await User.findOne({gmail: gmail});
        if(!user){
            return done(null, false, {message: 'User not found!'});
        }if(!bcrypt.compare(password: user.passport)){
            return done(null, false, {message: 'Incorrect Password'})
        }
        return done(null, user);
    } catch (error) {
        return done(err);
    }
}))

//create serial id
//whenever we login it create user id insider session
passport.serializeUser((user, done)=>{
    done(null, user.id);
});

//find session info using session id 
passport.deserializeUser(async (id, done)=>{
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
})