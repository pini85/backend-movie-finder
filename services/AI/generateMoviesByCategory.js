const openai = require('./config');
const aiMovieCategories = require('../../models/aiMovieCategory');
const { getMovieByTitle } = require('../../API/tmdb');

const generatePrompt = (exisitingMovie, category, numberOfMovies) => {
  return `Suggest ${numberOfMovies} movie title and with their imdb rating that fit the ${category} category. Should not include this ${exisitingMovie}. Use the exact syntax of the example below. needs to be json format
  example:
  {"category": "${category}", "movies":[{"title":,"rating":}]}
`;
};

const generateMoviesByCategory = async (category, numberOfMovies) => {
  //find the movie in side movie array of ai categroy that has the category name
  try {
    if (numberOfMovies > 15) {
      throw new Error('Number of movies must be less than 15');
    }
    const categoryData = await aiMovieCategories.findOne({
      categoryName: category,
    });
    const exisitingMovie = categoryData.mainMovie.title;

    const promptTokens = generatePrompt(category).split(' ').length;
    const completionTokens = Number(numberOfMovies) * 11;

    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: generatePrompt(exisitingMovie, category, numberOfMovies),
      temperature: 0.2,
      max_tokens: promptTokens + completionTokens,
    });

    const text = completion.data.choices[0].text;

    const data = JSON.parse(text);
    const movies = await Promise.all(
      data.movies.map(async (movie) => {
        const movieData = await getMovieByTitle(movie.title);

        movie.title = movieData.results[0].title;
        movie.vote_average = movie.rating;
        movie.poster_path = movieData.results[0].poster_path;
        movie.release_date = movieData.results[0].release_date;
        movie.id = movieData.results[0].id;
        return movie;
      })
    );

    return movies;
  } catch (e) {
    return e;
  }
};

module.exports = generateMoviesByCategory;
