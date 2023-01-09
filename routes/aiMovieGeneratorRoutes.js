const aiMovieCategories = require('../models/aiMovieCategory');
const generateMovieCategory = require('../services/AI/generateMovieCategory');
const generateMoviesByCategory = require('../services/AI/generateMoviesByCategory');

module.exports = (app) => {
  app.post('/api/ai/generateCategory', async (req, res) => {
    // const userId = req.body.user._id;
    try {
      const category = await generateMovieCategory();

      const movieObj = {
        title: category.mainMovie.title,
        vote_average: category.mainMovie.vote_average,
        poster_path: category.mainMovie.poster_path,
        release_date: category.mainMovie.release_date,
        id: category.mainMovie.id,
      };

      const aiMovieCategory = new aiMovieCategories({
        categoryName: category.categoryName,
        keywords: category.keywords,
        mainMovie: movieObj,
        // createdByUser: userId,
      });
      await aiMovieCategory.save();
      res.send(category);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.get('/api/ai/movieCategories', async (req, res) => {
    try {
      const categories = await aiMovieCategories.find({});
      res.send(categories);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.get('/api/ai/moviesByCategory/:categoryName', async (req, res) => {
    const { categoryName } = req.params;

    try {
      const movies = await aiMovieCategories.find({ categoryName });

      const data = movies[0];
      res.send(data);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.post('/api/ai/generateMoviesByCategory', async (req, res) => {
    const { categoryName, numberOfMovies } = req.body;

    try {
      const movies = await generateMoviesByCategory(categoryName, numberOfMovies);
      console.log(movies);
      await aiMovieCategories.findOneAndUpdate({ categoryName }, { $push: { movies } });
      res.send(movies);
    } catch (e) {
      res.status(400).send({ error: 'Could not generate movies by category', e });
    }
  });
};
