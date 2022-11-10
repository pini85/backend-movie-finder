const axios = require('axios');

const apiDomain = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'http://www.my-cheap-ass-server.com';
  }
  return 'http://www.my-cheap-ass-server.com';
};

const getTorrentStream = async (magnet) => {
  const url = apiDomain();
  console.log({ url });

  //change ? in magnet to #

  const link = encodeURIComponent(magnet.trim());

  const { data } = await axios.post(`${url}/api/torrents?torrent=${link}`);

  return data;
};
const getTorrentDetails = async () => {
  const url = apiDomain();
  const { data } = await axios.get(`${url}/api/torrents`);
  return data;
};
module.exports = {
  getTorrentStream,
  getTorrentDetails,
};
