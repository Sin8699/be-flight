const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const _ = require('lodash');
const sendMail = require('../helpers/email');
const crypto = require('crypto');
const configs = require('../configs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const HelperUser = require('../helpers/user');
const { ROLE_USER } = require('../constant');
const requireRole = require('../middlewares/require-role');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const stateUser = _.get(req, 'user.dataValues');

  try {
    const user = await User.getUser({ id: stateUser.id });
    return res.json({
      message: 'Get info user successfully',
      ..._.pick(user, ['fullName', 'email', 'numberPhone', 'accountBalance', 'role']),
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: 'User not found',
    });
  }
});

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
    const token = HelperUser.generalToken(user);
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
  const { username, password, email, fullName, numberPhone, accountBalance } = req.body;
  User.createUser({
    username,
    password,
    email,
    fullName,
    numberPhone,
    accountBalance,
  })
    .then(async (user) => {
      const token = HelperUser.generalToken(user);

      res.json({ message: 'User created successfully', token });
    })
    .catch((err) => {
      console.log('err', err);
      res.status(401).json({
        error: 'Error when create account.',
      });
    });
});

router.post('/create-user', requireRole(ROLE_USER.ADMIN), function (req, res, next) {
  const { username, password, email, fullName, numberPhone, accountBalance, role } = req.body;
  User.createUser({
    username,
    password,
    email,
    fullName,
    numberPhone,
    accountBalance,
    role,
  })
    .then(async (user) => {
      const token = HelperUser.generalToken(user);

      res.json({ message: 'User created successfully', token });
    })
    .catch((err) => {
      console.log('err', err);
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

  return res.json({
    message: 'Check your email to reset password',
  });
});

router.post('/reset-password/:token', async (req, res) => {
  const token = req.params.token;

  const user = await User.getUser({
    resetPasswordToken: token,
    resetPasswordExpireTime: {
      [Op.gt]: new Date(),
    },
  });

  if (!user) {
    return res.status(400).send({
      message: 'Your token has expired',
    });
  }

  const newPassword = _.trim(req.body.newPassword);

  const hashed = User.hashPassword(newPassword);

  await User.updateUser(user.id, {
    password: hashed,
    resetPasswordToken: null,
    resetPasswordExpireTime: null,
  });

  return res.json({
    message: 'Reset password success',
  });
});

router.put('/update-user', requireRole(ROLE_USER.ADMIN), async (req, res) => {
  const stateUser = _.get(req, 'user.dataValues');

  const data = _.get(req, 'body');
  const userId = stateUser.id;

  try {
    await User.updateUser(userId, {
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
