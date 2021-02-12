const _ = require('lodash');
const passport = require('passport');

module.exports = function (role = []) {
  if (typeof role === 'string') {
    role = [role];
  }

  return async (req, res, next) => {
    const stateUser = _.get(req, 'user.dataValues');

    const userRole = _.get(req, 'user.role');
    if (role.length && userRole && !role.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };
};
