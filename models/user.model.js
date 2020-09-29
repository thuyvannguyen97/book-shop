const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    maxlength: [30, 'Name cannot be more than 30 leters']
  }
  ,
  phone: {
    type: String,
    required: [true, 'Phone is required.']
  },
  email: {
    type: String,
    unique: [true, 'Email existed.'],
    required: [true, 'Email is required.']
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  avatarUrl: String,
  isAdmin: Boolean,
  wrongLoginCount: Number,
});

var User = mongoose.model("User", userSchema, "users");

module.exports = User;