const { Router } = require('express');
const queries = require('../db/queries');
const { body, validationResult } = require('express-validator');
const homeRouter = new Router();

homeRouter.get('/', async (req, res) => {
  const posts = await queries.getPosts();
  res.render('home', { posts: posts, isAuth: req.isAuthenticated() });
});

homeRouter.post(
  '/',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next({ error: { msg: 'You are not authenticated' } });
    }
    next();
  },
  body('title').trim().notEmpty().withMessage('Please provide a title'),
  body('content').trim().notEmpty().withMessage('Please provide some content'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors.mapped());
    }
    const { title, content } = req.body;
    try {
      await queries.insertPost(title, content, req.user.id);
      return res.redirect('/');
    } catch (err) {
      next({ database: { msg: err.msg } });
    }
  }
);
homeRouter.use(async (err, req, res, next) => {
  const posts = await queries.getPosts();
  res.render('home', { err: err, posts: posts, isAuth: req.isAuthenticated() });
});
homeRouter.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) next(err);
  });
  res.redirect('/login');
});
module.exports = homeRouter;
