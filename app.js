const express = require('express');
require('dotenv').config();
const path = require('path');
const homeRouter = require('./routes/home');
const signUpRouter = require('./routes/sign-up');
const loginRouter = require('./routes/login');
const session = require('express-session');
const PGStore = require('connect-pg-simple')(session);
const passport = require('passport');
const app = express();

// Setup ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setupt assets for css files and stuff
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

// Setup url encoding for form submissions
app.use(express.urlencoded({ extended: true }));

// Setup Session for app
app.use(
  session({
    store: new PGStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

// Passport setup
app.use(passport.session());
require('./passport-config/passport');

// Routes
app.use('/', homeRouter);
app.use('/sign-up', signUpRouter);
app.use('/login', loginRouter);
// Setup Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Running on ' + PORT);
  }
});
