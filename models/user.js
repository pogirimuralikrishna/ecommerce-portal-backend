const mongoose = require('mongoose')

// Define Schema

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

// Define Model

const User = mongoose.model('User', userSchema)

module.exports = User

