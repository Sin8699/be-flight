const _ = require('lodash');

module.exports = function (role = []) {
  if (typeof role === 'string') {
    role = [role];
  }

  return (
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const stateUser = _.get(req, 'user.dataValues');
      const userRole = stateUser.role;

      if (role.length && !role.includes(userRole)) {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      return next();
    }
  );
};
