const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const _ = require('lodash');
const sendMail = require('../models/email');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json({
    user: req.user.dataValues,
  });
});
router.post('/changePassword', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
router.post('/forgotPassword', async (req, res) => {
  const email = _.get(req, 'body.email', null);
  const user = await User.getUser({
    email,
  });
  if (!user) {
    return res.status(400).send({
      error: 'Email not exist.',
    });
  }
  let rPass = Math.random().toString(36).substring(3);
  // update new password
  await User.updatePassword(user.id, rPass);
  await sendMail(
    email,
    '[] - Password reset',
    `Your username is : ${user.username}
     Your new password is : ${rPass}`
  );
  res.json({
    message: 'Okay',
  });
});
router.put('/update-user', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // check staff token
  const stateUser = _.get(req, 'user.dataValues');
  if (stateUser.role !== 'staff') {
    return res.status(400).send({
      error: 'Staff required.',
    });
  }
  // get userId to update
  const userId = _.get(req, 'query.userId', null);
  const user = await User.getUser({
    id: userId,
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
      message: 'Sucessfully updated user.',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: 'Server error.',
    });
  }
});
module.exports = router;
