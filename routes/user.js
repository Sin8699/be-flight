const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const sendMail = require('../models/email');
const crypto = require('crypto');
const configs = require('../configs');

router.post('/login', async function (req, res, next) {
  const { email, hashPassword } = req.body;

  if (!email || !hashPassword) {
    return res.status(401).json({ message: 'Invalid' });
  }

  let user = await User.getUser({ email });
  if (!user) {
    res.status(401).json({ message: 'No such user found' });
  }

  if (User.verifyPassword(hashPassword, user.password)) {
    let payload = { id: user.id, role: user.role };
    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || '',
      expiresIn: '10h',
    });
    res.json({
      code: 0,
      message: 'Login successful',
      token: token,
      email: user.email,
    });
  } else {
    res.status(401).json({ code: 1, message: 'Password is incorrect' });
  }
});

router.post('/register', function (req, res, next) {
  const { username, password, email, fullName, numberPhone } = req.body;
  User.createUser({
    username,
    password,
    email,
    fullName,
    numberPhone,
    role,
  })
    .then(async () => {
      res.json({ message: 'User created successfully' });
    })
    .catch((err) => {
      res.status(401).json({
        error: 'Error when create account.',
      });
    });
});

router.post('/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userId = _.get(req, 'user.dataValues.id', null);
  const oldPass = _.get(req, 'body.oldPass', null);
  const newPass = _.get(req, 'body.newPass', null);
  const currentPassHashed = _.get(req, 'user.dataValues.password');

  const verifyPassword = User.verifyPassword(oldPass, currentPassHashed);
  if (!verifyPassword) {
    return res.status(400).send({
      error: `Old password didn't match.`,
    });
  }
  await User.updatePassword(userId, newPass);
  res.json({
    message: 'Successfully updated password.',
  });
});

router.post('/forgot-password', async (req, res) => {
  const email = _.get(req, 'body.email', null);

  const user = await User.getUser({
    email,
  });

  if (!user) {
    return res.status(400).send({
      error: 'Email not exist.',
    });
  }

  const randomToken = crypto.randomBytes(64).toString('hex');
  const resetPasswordExpireTime = new Date(Date.now() + configs.resetPasswordTokenLiveTime * 60 * 1000); //live time in minutes

  await User.updateForgot({ resetPasswordToken: randomToken, resetPasswordExpireTime, userId: user.id });

  const resetPasswordUrl = `${configs.appUrl}/reset-password/${randomToken}`; //update later

  await sendMail(
    email,
    'Reset password',
    `Please reset your password now, its time limit is 1 hour : ${resetPasswordUrl}`
  );

  return res.status(400).send({
    message: 'Check your email to reset password',
  });
});

router.put('/update-user', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // check staff token
  const stateUser = _.get(req, 'user.dataValues');
  if (stateUser.role !== 'ADMIN') {
    return res.status(403).send({
      error: 'Forbidden',
    });
  }

  const user = await User.getUser({
    id: stateUser.id,
  });

  if (!user) {
    return res.status(400).send({
      error: 'User not found.',
    });
  }

  const data = _.get(req, 'body');

  try {
    await User.updateUser({
      userId,
      ...data,
    });
    return res.json({
      message: 'Success updated user.',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: 'Server error.',
    });
  }
});

module.exports = router;
