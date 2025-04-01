const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const queries = require('../db/queries');
const bcrypt = require('bcryptjs');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await queries.getUserByName(username);
      if (!user) {
        return done(null, false, { message: 'Username not found' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect Password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await queries.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
