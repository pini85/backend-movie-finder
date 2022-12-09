const keys = require('../config/keys');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.googleClientID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: keys.googleClientID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: 'Invalid user detected. Please try again' };
  }
};
module.exports = verifyGoogleToken;
