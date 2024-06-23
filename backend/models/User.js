const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  phoneNumber: { type: String, unique: true },
  age: Number,
  gender: String,
  password: String,
  city: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
