const openai = require('./config');
const aiMovieCategory = require('../../models/aiMovieCategory');
const { getMovieByTitle } = require('../../API/tmdb');

const generatePrompt = () => {
  return `Suggest another unique movie category and provide a popular movie in this category with a high IMDb rating.The category and movie must be unique.  Avoid commonly used genres like action, thriller, and romance. think outside the box. Also give me 5 keywords the describe the category. All data is with double quotes expect the array of keywords. Example: {"categoryName": "category","keywords":["keywords"],"mainMovie":{"name": "movie title", "rating": "8.5"}}
  `;
};

const generateMovieCategory = async () => {
  const categories = await aiMovieCategory.find({});
  const existingCategories = categories.map((category) => category.categoryName);
  const exisitingMovieNames = categories.map((category) => category.mainMovie.name);

  let suggestion;
  let completion;
  let category;
  let movie;
  let attempts = 0;
  const maxAttempts = 10;
  try {
    do {
      completion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: generatePrompt(existingCategories, exisitingMovieNames),
        temperature: 1,
        max_tokens: 200,
      });
      console.log(completion.data.choices[0].text);
      suggestion = JSON.parse(completion.data.choices[0].text);

      category = suggestion.categoryName;
      movie = suggestion.mainMovie.name.trim();
      attempts += 1;

      if (attempts >= maxAttempts) {
        throw new Error('Could not find a unique suggestion after 10 attempts');
      }
    } while (
      existingCategories.includes(category) ||
      exisitingMovieNames.includes(movie)
    );
    const tmdbMovie = await getMovieByTitle(suggestion.mainMovie.name);
    console.log(tmdbMovie.results[0].id);
    suggestion.mainMovie.title = movie;
    suggestion.mainMovie.id = tmdbMovie.results[0].id;
    suggestion.mainMovie.poster_path = tmdbMovie.results[0].poster_path;
    suggestion.mainMovie.release_date = tmdbMovie.results[0].release_date;
    suggestion.mainMovie.vote_average = tmdbMovie.results[0].vote_average;
    return suggestion;
  } catch (e) {
    console.log({ e });
  }
};

module.exports = generateMovieCategory;
