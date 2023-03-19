const express = require('express');
const {
  blog_create,
  blog_posts,
  blog_post,
  blog_edit,
} = require('../controllers/blogController');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

const router = express.Router();

// create a post
router.post('/create', uploadMiddleware.single('file'), blog_create);

// list 20 posts
router.get('/posts', blog_posts);

// get a blog post
router.get('/post/:id', blog_post);

// edit a blog
router.put('/post', uploadMiddleware.single('file'), blog_edit);

module.exports = router;
