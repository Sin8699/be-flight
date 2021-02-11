const jwt = require('jsonwebtoken');
const config = require('../configs');

const generalToken = (user) => {
  let payload = { id: user.id, role: user.role };
  let token = jwt.sign(payload, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER || '',
    expiresIn: config.jwtExpTime,
  });

  return token;
};

module.exports = { generalToken };
