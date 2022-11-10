const mongoose = require('mongoose');

const { Schema } = mongoose;

const user = new Schema({
  _id: Schema.Types.ObjectId,
  googleId: String,
});

module.exports = mongoose.model('users', user);
