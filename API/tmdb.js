const axios = require('axios');
const ApiKey = '3e296e6f6a1b142633468c58b584ab9b';

const getTmdbWithId = async (id) => {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${ApiKey}&language=en-US`
  );

  return data;
};
const getMovieByTitle = async (title) => {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${ApiKey}&query=${title}`
  );
  return data;
};
module.exports = {
  getTmdbWithId,
  getMovieByTitle,
};
