const mongoose = require('mongoose');
const { Schema } = mongoose;

const savedMoviesSchema = new Schema({
  movies: [],
  // userId: { type: Schema.Types.ObjectId, ref: 'user' },
  userId: Schema.Types.ObjectId,
});

module.exports = mongoose.model('savedMovies', savedMoviesSchema);
