const verifyGoogleToken = require('../services/verifyGoogleToken');
const User = require('../models/User');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
module.exports = (app) => {
  // app.post('api/auth/google/signup', async (req, res) => {
  //   try {
  //     console.log({ verified: verifyGoogleToken(req.body.credential) });
  //     if (req.body.credential) {
  //       const verificationResponse = await verifyGoogleToken(req.body.credential);

  //       if (verificationResponse.error) {
  //         return res.status(400).json({
  //           message: verificationResponse.error,
  //         });
  //       }
  //       const profile = verificationResponse?.payload;
  //       console.log({ profile });
  //       // DB.push(profile);
  //       res.status(201).json({
  //         message: 'Signup was successful',
  //         user: {
  //           firstName: profile?.given_name,
  //           lastName: profile?.family_name,
  //           picture: profile?.picture,
  //           email: profile?.email,
  //           token: jwt.sign({ email: profile?.email }, 'myScret', {
  //             expiresIn: '1d',
  //           }),
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       message: 'An error occurred. Registration failed.',
  //     });
  //   }
  // });

  app.post('/api/auth/google/login', async (req, res) => {
    try {
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);
        if (verificationResponse.error) {
          return res.status(400).json({
            message: verificationResponse.error,
          });
        }

        const profile = verificationResponse?.payload;
        // console.log({ profile });

        const existsInDB = await User.findOne({ email: profile?.email });

        if (!existsInDB) {
          console.log('user does not exsits');
          // return console.log('user does not exist');
          //save user to db
          const user = new User({
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
          });
          await user.save();
        }

        res.status(201).json({
          message: 'Login was successful',
          user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
            token: jwt.sign({ email: profile?.email }, keys.jwt_secret, {
              expiresIn: '1d',
            }),
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error?.message || error,
      });
    }
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect(url);
  });

  app.get('/api/current_user', (req, res) => {
    console.log(req.user);
    return res.send(req.user);
  });
};
