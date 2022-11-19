const passport = require('passport');

module.exports = (app) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    let url;
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      url = 'http://localhost:3000';
    }

    if (process.env.NODE_ENV === 'production') {
      url = 'https://www.pinimovies.com/';
    }

    res.redirect(url);
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    return res.send(req.user);
  });
};
