const mongoose = require('mongoose');

const { Schema } = mongoose;

const user = new Schema({
  firstName: String,
  lastName: String,
  picture: String,
  email: String,
});

module.exports = mongoose.model('users', user);
