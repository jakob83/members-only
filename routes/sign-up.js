const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const queries = require('./../db/queries');
const bcrypt = require('bcryptjs');
const signUpRouter = new Router();

signUpRouter.get('/', (req, res) => {
  res.render('sign-up-form');
});
signUpRouter.post(
  '/',
  body('username')
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username can only be 20 characters')
    .not()
    .isEmpty()
    .withMessage('username must be filled out'),
  body('email').isEmail().withMessage('Invalid Email format'),
  body('password').isLength({ min: 6 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(errors.mapped());
    }
    const { username, email, password } = req.body;
    const encryptedPW = await bcrypt.hash(password, 10);
    try {
      await queries.insertUser(username, email, encryptedPW);
      res.redirect('login');
    } catch (err) {
      next({ database: { msg: err.message } });
    }
  },
  (err, req, res, next) => {
    res.render('sign-up-form', { err: err });
  }
);

module.exports = signUpRouter;
