const openai = require('./config');
const json5 = require('json5');
const aiMovieCategories = require('../../models/aiMovieCategory');
const { getMovieByTitle } = require('../../API/tmdb');

const generatePrompt = (exisitingMovie, category, numberOfMovies) => {
  return `Suggest ${numberOfMovies} unique highly rated movie titles with their imdb rating that fit the ${category} category. Should not include this ${exisitingMovie}. All data is with double quotes.
  Example:
  {"category": "category", "movies":[{"title":"title 1","rating":"7.5"},{"title":"title 2","rating":"8.1"}]}
`;
};

const generateMoviesByCategory = async (category, numberOfMovies) => {
  try {
    if (numberOfMovies > 15) {
      throw new Error('Number of movies must be less than 15');
    }
    const categoryData = await aiMovieCategories.findOne({
      categoryName: category,
    });

    const exisitingMovie = categoryData?.mainMovie?.title ?? '';

    const promptTokens = generatePrompt(category).split(' ').length;
    const completionTokens = Number(numberOfMovies) * 11;

    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: generatePrompt(exisitingMovie, category, numberOfMovies),
      temperature: 0.2,
      max_tokens: promptTokens + completionTokens,
    });
    const text = completion.data.choices[0].text;

    const data = json5.parse(text);

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
