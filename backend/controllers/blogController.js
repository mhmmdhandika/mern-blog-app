const BlogModel = require('../models/BlogModel');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET;

// create a blog post
const blog_create = async (req, res) => {
  const { originalname, path } = req.file;

  // fixing image upload
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;

  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) {
      res.status(401).json({
        message: 'Unauthorized activity',
      });
      return;
    }
    const { title, content } = req.body;

    const postDoc = await BlogModel.create({
      title,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
};

// list 20 blog posts
const blog_posts = async (req, res) => {
  const posts = await BlogModel.find()
    .populate('author', ['username', 'name'])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
};

// get a blog post
const blog_post = async (req, res) => {
  const { id } = req.params;
  const postDoc = await BlogModel.findById(id).populate('author', [
    'username',
    'name',
  ]);
  res.json(postDoc);
};

// edit a blog
const blog_edit = async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, content } = req.body;
    const post = await BlogModel.findById(id);
    const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      return res.status(400).json('You are not the author');
    }

    await post.updateOne({
      title,
      content,
      cover: newPath ? newPath : post.cover,
    });
    res.json(post);
  });
};

// delete a blog
const blog_delete = async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized activity',
      });
    }

    const { id } = req.body;

    try {
      await BlogModel.deleteOne({ _id: id });
      res.json({ message: 'Delete Successfully!' });
    } catch (e) {
      res.status(400).json({
        message: e.message,
      });
    }
  });
};

module.exports = {
  blog_create,
  blog_posts,
  blog_post,
  blog_edit,
  blog_delete,
};
