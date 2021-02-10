const router = require('express').Router();
const User = require('../models/user');

router.post('/', function (req, res, next) {
  const { username, password, email, fullName, identity_id } = req.body;
  User.createUser({
    username,
    password,
    email,
    fullName,
    identity_id,
  })
    .then(async () => {
      res.json({ message: 'User created successfully' });
    })
    .catch((err) => {
      res.json({
        error: 'Error when create account.',
      });
    });
});
module.exports = router;
