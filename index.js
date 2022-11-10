const express = require('express');
const app = express();
const cors = require('cors');
const enforce = require('express-sslify');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
app.use(bodyParser.json());
require('./models/User');
require('./models/SavedMovies');
require('./services/passport');
mongoose.connect(keys.mongoURI);

//this wont work with passport js
// app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.use(cors());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello world');
});
require('./routes/authRoutes')(app);
require('./routes/savedMovieRoutes')(app);
require('./routes/savedQueriesRoutes')(app);
require('./routes/watchMovieRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  //if the handlers above won't resolve the request it will go to the next route handler below

  //Express will serve up production assests. Like our main.js or main.css
  app.use(express.static('client/build'));
  //if this handler cannot resolve it then go to the next one.
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
