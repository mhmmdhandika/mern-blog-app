const express = require('express');
const {
  user_register,
  user_login,
  user_profile,
  user_logout,
} = require('../controllers/userController');

const router = express.Router();

// register user
router.post('/register', user_register);

// login user
router.post('/login', user_login);

// profile user
router.get('/profile', user_profile);

// logout user
router.post('/logout', user_logout);

module.exports = router;
