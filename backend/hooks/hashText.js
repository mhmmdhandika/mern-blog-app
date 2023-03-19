const bcrypt = require('bcrypt');

function hashText(text) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(text, salt);
  return hash;
}

module.exports = hashText;
