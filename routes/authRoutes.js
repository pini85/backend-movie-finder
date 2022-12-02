const passport = require('passport');
let url;

if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:3000/';
}

if (process.env.NODE_ENV === 'production') {
  url = 'https://www.pinimovies.com/';
}

module.exports = (app) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: url,
      failureRedirect: url,
    })
  );

  // app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  //   let url;
  //
  //   if (process.env.NODE_ENV === 'development') {
  //     url = 'http://localhost:3000/';
  //   }

  //   if (process.env.NODE_ENV === 'production') {
  //     url = 'https://www.pinimovies.com/';
  //   }

  //   res.redirect(url);
  // });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect(url);
  });

  app.get('/api/current_user', (req, res) => {
    console.log(req.user);
    return res.send(req.user);
  });
};
