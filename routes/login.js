const { Router } = require('express');
const passport = require('passport');
const loginRouter = new Router();

loginRouter.get('/', (req, res) => {
  if (req.query.err) {
    res.render('login', { err: { username: { msg: req.query.err } } });
  }
  res.render('login');
});

loginRouter.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?err=Incorrect Username or Password',
  })
);

module.exports = loginRouter;
