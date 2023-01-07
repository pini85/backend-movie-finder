const verifyGoogleToken = require('../services/verifyGoogleToken');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
module.exports = (app) => {
  app.post('/api/auth/google/login', async (req, res) => {
    try {
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);
        if (verificationResponse.error) {
          return res.status(400).json({
            message: verificationResponse.error,
          });
        }
        let userDoc;

        const profile = verificationResponse?.payload;
        const existsInDB = await User.findOne({ email: profile?.email });

        if (!existsInDB) {
          const user = new User({
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
          });
          userDoc = await user.save();
        } else {
          userDoc = existsInDB;
        }
        const token = jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });

        res.json({
          message: 'Login was successful',
          user: {
            ...userDoc._doc,
          },
          token,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error?.message || error,
      });
    }
  });
};
