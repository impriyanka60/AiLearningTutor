const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // NOTE: In real apps, hash this
});

module.exports = mongoose.model('User', UserSchema);
