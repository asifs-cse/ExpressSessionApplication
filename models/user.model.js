const mongoose  = require('mongoose');

//create schema
const userSchema = mongoose.Schema({
    userFirstName:{
        type: String,
        required: true
    },
    userLastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;