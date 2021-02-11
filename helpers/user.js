const jwt = require('jsonwebtoken');

const generalToken = (user) => {
  let payload = { id: user.id, role: user.role };
  let token = jwt.sign(payload, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER || '',
    expiresIn: '10h',
  });

  return token;
};

module.exports = { generalToken };
