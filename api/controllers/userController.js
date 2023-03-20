const UserModel = require('../models/UserModel');
const hashText = require('../hooks/hashText');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { passwordStrength } = require('check-password-strength');

// config env
require('dotenv').config();

// get the secret key for jwt
const secretKey = process.env.SECRET;

// register user
const user_register = async (req, res) => {
  const { name, username, password } = req.body;

  // check name letters only
  // return bool
  const isNameLettersOnly = /^[a-z]+$/i.test(name);

  if (!isNameLettersOnly) {
    return res.status(400).json({
      message: 'Your name must be letters only!',
    });
  }

  // check username available
  const isUsernameAvailable = await UserModel.findOne({ username });

  // if username already exists
  if (isUsernameAvailable !== null) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // check is password strength enough
  const checkPasswordStrength = passwordStrength(password, [
    {
      id: 0,
      value: 'Too weak',
      minDiversity: 0,
      minLength: 0,
    },
    {
      id: 1,
      value: 'Weak',
      minDiversity: 1,
      minLength: 6,
    },
    {
      id: 2,
      value: 'Medium',
      minDiversity: 2,
      minLength: 8,
    },
    {
      id: 3,
      value: 'Strong',
      minDiversity: 3,
      minLength: 10,
    },
  ]);

  switch (checkPasswordStrength.id) {
    // if password too weak or weak
    case 0:
    case 1:
      return res.status(400).json({
        message: `Your password is ${checkPasswordStrength.value.toLowerCase()}`,
      });
  }

  const user = {
    name,
    username,
    password: hashText(password),
  };

  try {
    const result = await UserModel.create(user);
    // if all input is valid
    // store user info to db
    // sign jwt
    jwt.sign({ username, id: result._id }, secretKey, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id: result._id,
        username,
      });
    });
  } catch (e) {
    res.status(400).json({ name: e.name, message: e.message });
  }
};

// login user
const user_login = async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  // if username is not registered yet
  if (!user) {
    return res.status(400).json({
      message: "Can't find the username",
    });
  }

  const isPassOk = bcrypt.compareSync(password, user.password);

  // if password doesn't matches
  if (!isPassOk) {
    return res.status(400).json({
      message: "Password doesn't match",
    });
  }

  // if all input is valid
  // give user they user info
  // sign jwt
  jwt.sign({ username, id: user._id }, secretKey, {}, (err, token) => {
    if (err) throw err;
    res.cookie('token', token).json({
      id: user._id,
      username,
    });
  });
};

// profile user
const user_profile = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      res.status(401).json({
        message: 'Unauthorized activity',
      });
      return;
    }
    res.json(info);
  });
};

// logout user
const user_logout = (req, res) => {
  res.cookie('token', '').json('ok');
};

module.exports = { user_register, user_login, user_profile, user_logout };
